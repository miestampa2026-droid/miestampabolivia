import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Faltan NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY. Definir en .env.local.'
  )
}

export function createBrowserSupabase() {
  return createClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!)
}
