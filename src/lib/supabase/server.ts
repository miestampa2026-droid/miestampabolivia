import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Faltan NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY. Definir en .env.local.'
  )
}

// Cliente Supabase para Server Components / Route Handlers / Server Actions.
// Usa las cookies de la request para conocer la sesión del usuario (RLS
// aplica con su propio JWT, no con la service role).
export function createServerSupabase() {
  const cookieStore = cookies()

  return createServerClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Se llama desde un Server Component (no puede escribir cookies);
          // el middleware ya se encarga de refrescar la sesión en cada request.
        }
      }
    }
  })
}
