import { ref } from 'vue'
import type { Apartment, CreateApartmentDTO, UpdateApartmentDTO } from '../types/apartment'
import { supabase } from '../lib/supabase'

export function useApartments() {
  const apartments = ref<Apartment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchApartments = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: err } = await supabase
        .from('apartments')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err

      apartments.value = data as Apartment[]
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const createApartment = async (apartment: CreateApartmentDTO) => {
    try {
      loading.value = true
      error.value = null

      const user = (await supabase.auth.getUser()).data.user
      
      const { data, error: err } = await supabase
        .from('apartments')
        .insert([{ ...apartment, user_id: user?.id }])
        .select()
        .single()

      if (err) throw err

      const newApartment = data as Apartment
      apartments.value = [newApartment, ...apartments.value]
      return newApartment
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  const updateApartment = async (id: string, updates: UpdateApartmentDTO) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: err } = await supabase
        .from('apartments')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (err) throw err

      const updatedApartment = data as Apartment
      const index = apartments.value.findIndex(apt => apt.id === id)
      if (index !== -1) {
        apartments.value[index] = updatedApartment
      }
      return updatedApartment
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteApartment = async (id: string) => {
    try {
      loading.value = true
      error.value = null

      const { error: err } = await supabase
        .from('apartments')
        .delete()
        .eq('id', id)

      if (err) throw err

      apartments.value = apartments.value.filter(apt => apt.id !== id)
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    apartments,
    loading,
    error,
    fetchApartments,
    createApartment,
    updateApartment,
    deleteApartment
  }
}