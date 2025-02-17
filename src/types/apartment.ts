export type Apartment = {
  id: string
  title: string
  description?: string
  price: number
  address: string
  latitude: number
  longitude: number
  bedrooms?: number
  bathrooms?: number
  area?: number
  images?: string[]
  status: 'available' | 'rented' | 'sold'
  user_id: string
  created_at: string
  updated_at: string
}

export type CreateApartmentDTO = Omit<Apartment, 'id' | 'user_id' | 'created_at' | 'updated_at'>
export type UpdateApartmentDTO = Partial<CreateApartmentDTO>