import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export function useSearch() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function search(query: string) {
    try {
      loading.value = true
      error.value = null

      // First check if Supabase is accessible
      try {
        const { data, error: pingError } = await supabase
          .from('place_types')
          .select('name')
          .limit(1)

        if (pingError) throw pingError
      } catch (e: any) {
        console.error('Supabase connection error:', e)
        throw new Error('Unable to connect to the database. Please try again later.')
      }

      // Ask ChatGPT to analyze the search query
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: `You are a real estate search assistant. Analyze the user's query and extract search criteria for apartments and nearby places. Return ONLY a JSON object with the following structure:
          {
            "apartments": {
              "filters": {
                "bedrooms": number or null,
                "bathrooms": number or null,
                "maxPrice": number or null,
                "minPrice": number or null
              }
            },
            "places": {
              "types": ["bar" and/or "restaurant"],
              "maxDistance": number (in meters) or null
            }
          }`
        }, {
          role: "user",
          content: query
        }],
        temperature: 0.7,
        max_tokens: 150
      })

      const response = completion.choices[0].message.content
      if (!response) throw new Error('Failed to analyze search query')

      const criteria = JSON.parse(response)
      console.log('Search criteria:', criteria)

      // Build the database queries based on the criteria
      let apartmentIds: string[] = []
      let placeIds: string[] = []

      // Query apartments based on criteria
      let apartmentQuery = supabase
        .from('apartments')
        .select('id')

      if (criteria.apartments.filters.bedrooms) {
        apartmentQuery = apartmentQuery.eq('bedrooms', criteria.apartments.filters.bedrooms)
      }
      if (criteria.apartments.filters.bathrooms) {
        apartmentQuery = apartmentQuery.eq('bathrooms', criteria.apartments.filters.bathrooms)
      }
      if (criteria.apartments.filters.maxPrice) {
        apartmentQuery = apartmentQuery.lte('price', criteria.apartments.filters.maxPrice)
      }
      if (criteria.apartments.filters.minPrice) {
        apartmentQuery = apartmentQuery.gte('price', criteria.apartments.filters.minPrice)
      }

      const { data: apartments, error: aptError } = await apartmentQuery

      if (aptError) throw aptError
      if (apartments) {
        apartmentIds = apartments.map(apt => apt.id)
      }

      // Query places based on criteria
      if (criteria.places.types && criteria.places.types.length > 0) {
        const { data: places, error: placeError } = await supabase
          .from('place_type_relations')
          .select(`
            place_id,
            place_types (
              name
            )
          `)
          .in('place_types.name', criteria.places.types)

        if (placeError) throw placeError
        if (places) {
          placeIds = places.map(p => p.place_id.toString())
        }
      }

      // If no specific filters were applied, return all IDs
      if (apartmentIds.length === 0 && !Object.values(criteria.apartments.filters).some(v => v !== null)) {
        const { data: allApartments, error: allAptError } = await supabase
          .from('apartments')
          .select('id')
        
        if (allAptError) throw allAptError
        if (allApartments) {
          apartmentIds = allApartments.map(apt => apt.id)
        }
      }

      return {
        apartments: apartmentIds,
        places: placeIds
      }
    } catch (e: any) {
      console.error('Search error:', e)
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    search,
    loading,
    error
  }
}