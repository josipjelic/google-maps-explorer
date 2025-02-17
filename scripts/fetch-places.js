import { createClient } from '@supabase/supabase-js'
import { createClient as createGoogleMapsClient } from '@google/maps'
import dotenv from 'dotenv'
import { program } from 'commander'

// Load environment variables
dotenv.config()

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Initialize Google Maps client
const googleMaps = createGoogleMapsClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
})

program
  .name('fetch-places')
  .description('Fetch bars and restaurants from Google Places API')
  .requiredOption('-l, --location <location>', 'Location (address or coordinates)')
  .option('-r, --radius <meters>', 'Search radius in meters', '1000')
  .option('-t, --type <type>', 'Place type (bar, restaurant, or both)', 'both')
  .parse(process.argv)

const options = program.opts()

// Generate a grid of points around Manhattan
function generateSearchPoints(centerLat, centerLng, gridSize = 4) {
  const points = []
  const latSpread = 0.02 // About 2.2km
  const lngSpread = 0.02 // About 2.2km
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const lat = centerLat - (latSpread * (gridSize/2)) + (latSpread * i)
      const lng = centerLng - (lngSpread * (gridSize/2)) + (lngSpread * j)
      points.push({ lat, lng })
    }
  }
  
  return points
}

async function getCoordinates(location) {
  // Check if location is already in coordinate format (lat,lng)
  if (/^-?\d+\.?\d*,-?\d+\.?\d*$/.test(location)) {
    const [lat, lng] = location.split(',').map(Number)
    return { lat, lng }
  }

  // Use geocoding to convert address to coordinates
  try {
    const response = await googleMaps.geocode({
      address: location
    }).asPromise()

    if (response.json.results.length === 0) {
      throw new Error('Location not found')
    }

    const { lat, lng } = response.json.results[0].geometry.location
    console.log(`Geocoded "${location}" to coordinates: ${lat},${lng}`)
    return { lat, lng }
  } catch (error) {
    throw new Error(`Geocoding failed: ${error.message}`)
  }
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchPlacesForLocation(coordinates, type, typeData) {
  console.log(`Fetching ${type}s at ${coordinates.lat},${coordinates.lng}...`)
  
  try {
    const placesResponse = await googleMaps.placesNearby({
      location: coordinates,
      radius: parseInt(options.radius),
      type
    }).asPromise()

    for (const place of placesResponse.json.results) {
      try {
        // Get detailed place information
        const detailsResponse = await googleMaps.place({
          placeid: place.place_id,
          fields: ['name', 'formatted_address', 'geometry', 'formatted_phone_number', 
                  'website', 'rating', 'user_ratings_total', 'opening_hours']
        }).asPromise()

        const details = detailsResponse.json.result

        // Insert place
        const { data: placeData, error: placeError } = await supabase
          .from('places')
          .upsert({
            name: details.name,
            place_id: place.place_id,
            address: details.formatted_address,
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            phone: details.formatted_phone_number,
            website: details.website,
            rating: details.rating,
            review_count: details.user_ratings_total,
            opening_hours: details.opening_hours,
            raw_data: details
          }, { onConflict: 'place_id' })
          .select('id')
          .single()

        if (placeError) {
          console.error(`Error inserting place: ${placeError.message}`)
          continue
        }

        // Create relation between place and type
        const { error: relationError } = await supabase
          .from('place_type_relations')
          .upsert({
            place_id: placeData.id,
            place_type_id: typeData.id
          }, { onConflict: 'place_id,place_type_id' })

        if (relationError) {
          console.error(`Error creating relation: ${relationError.message}`)
        }

        console.log(`Added: ${details.name}`)
        
        // Add a small delay to avoid hitting rate limits
        await delay(200)
      } catch (error) {
        console.error(`Error processing place ${place.name}: ${error.message}`)
        continue
      }
    }
  } catch (error) {
    console.error(`Error fetching places at ${coordinates.lat},${coordinates.lng}: ${error.message}`)
  }
}

async function fetchPlaces() {
  try {
    const centerCoords = await getCoordinates(options.location)
    const searchPoints = generateSearchPoints(centerCoords.lat, centerCoords.lng)
    const types = options.type === 'both' ? ['bar', 'restaurant'] : [options.type]
    
    for (const type of types) {
      console.log(`Starting to fetch ${type}s...`)
      
      // First, ensure the place type exists
      const { data: typeData } = await supabase
        .from('place_types')
        .upsert({ name: type }, { onConflict: 'name' })
        .select('id')
        .single()

      if (!typeData) {
        console.error(`Failed to get/create place type: ${type}`)
        continue
      }

      // Fetch places for each point in our grid
      for (const point of searchPoints) {
        await fetchPlacesForLocation(point, type, typeData)
        // Add a delay between grid points to avoid hitting API limits
        await delay(1000)
      }
    }

    console.log('Done!')
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

fetchPlaces()