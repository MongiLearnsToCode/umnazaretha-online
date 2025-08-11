import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Type-safe Supabase client
export type TypedSupabaseClient = SupabaseClient<Database>

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Create and export the Supabase client
export const supabase: TypedSupabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)

// Helper function to get error message from Supabase response
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message
  }
  return 'An unknown error occurred'
}

// Helper function to check if user is authenticated
export async function isAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

// Helper function to get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    throw new Error(getErrorMessage(error))
  }
  return user
}
