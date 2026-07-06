import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Faltan NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY. Definir en .env.local.'
  )
}

// createBrowserClient (@supabase/ssr) en vez de createClient a secas:
// guarda la sesión en cookies (no solo localStorage) para que el
// middleware y los Server Components puedan leerla.
export function createBrowserSupabase() {
  return createBrowserClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!)
}
