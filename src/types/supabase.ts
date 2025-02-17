export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      apartments: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          address: string
          latitude: number
          longitude: number
          bedrooms: number | null
          bathrooms: number | null
          area: number | null
          images: string[] | null
          status: 'available' | 'rented' | 'sold'
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          address: string
          latitude: number
          longitude: number
          bedrooms?: number | null
          bathrooms?: number | null
          area?: number | null
          images?: string[] | null
          status?: 'available' | 'rented' | 'sold'
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          address?: string
          latitude?: number
          longitude?: number
          bedrooms?: number | null
          bathrooms?: number | null
          area?: number | null
          images?: string[] | null
          status?: 'available' | 'rented' | 'sold'
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      places: {
        Row: {
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
          opening_hours: Json | null
          raw_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          place_id: string
          address: string
          latitude: number
          longitude: number
          phone?: string | null
          website?: string | null
          rating?: number | null
          review_count?: number | null
          opening_hours?: Json | null
          raw_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          place_id?: string
          address?: string
          latitude?: number
          longitude?: number
          phone?: string | null
          website?: string | null
          rating?: number | null
          review_count?: number | null
          opening_hours?: Json | null
          raw_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      place_types: {
        Row: {
          id: number
          name: 'bar' | 'restaurant'
        }
        Insert: {
          id?: number
          name: 'bar' | 'restaurant'
        }
        Update: {
          id?: number
          name?: 'bar' | 'restaurant'
        }
      }
      place_type_relations: {
        Row: {
          place_id: number
          place_type_id: number
          place_types?: { name: 'bar' | 'restaurant' }
        }
        Insert: {
          place_id: number
          place_type_id: number
        }
        Update: {
          place_id?: number
          place_type_id?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      apartment_status: 'available' | 'rented' | 'sold'
    }
  }
}