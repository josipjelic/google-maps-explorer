export interface Place {
  id: number
  name: string
  place_id: string
  address: string
  latitude: number
  longitude: number
  phone: string | null
  website: string | null
  rating: number | null
  review_count: number | null
  opening_hours: any | null
  raw_data: any | null
  created_at: string
  updated_at: string
}