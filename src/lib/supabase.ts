import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storage: window.localStorage
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-client'
      }
    },
    db: {
      schema: 'public'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
)

// Initialize the connection and verify it works
let initialized = false
let initializationPromise: Promise<void> | null = null

const initializeConnection = async (retries = 3, backoff = 1000) => {
  if (initialized) return
  if (initializationPromise) return initializationPromise

  initializationPromise = (async () => {
    for (let i = 0; i < retries; i++) {
      try {
        // Test the connection with a simple query
        const { data, error } = await supabase
          .from('place_types')
          .select('name')
          .limit(1)

        if (error) throw error

        if (data) {
          console.log('Supabase connection established')
          initialized = true
          return
        }
      } catch (error) {
        console.error(`Supabase connection attempt ${i + 1}/${retries} failed:`, error)
        
        if (i < retries - 1) {
          // Wait with exponential backoff before retrying
          await new Promise(resolve => setTimeout(resolve, backoff * Math.pow(2, i)))
        } else {
          console.error('Failed to establish Supabase connection after all retries')
        }
      }
    }
  })()

  try {
    await initializationPromise
  } finally {
    initializationPromise = null
  }
}

// Initialize connection when the client is created
initializeConnection().catch(console.error)

// Export a function to check connection status
export const checkConnection = async () => {
  if (!initialized) {
    await initializeConnection()
  }
  return initialized
}