import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const router = useRouter()

  const signInWithEmail = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null
      
      // Mock authentication
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (email === 'demo@example.com' && password === 'password') {
        router.push('/apartments')
        return { user: { email } }
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    try {
      loading.value = true
      error.value = null
      
      await new Promise(resolve => setTimeout(resolve, 500))
      router.push('/')
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    signInWithEmail,
    signOut
  }
}