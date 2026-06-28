import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Cliente admin con service_role. Bypassa RLS.
// SOLO usar en server (route handlers, server components, scripts).
export function createAdminSupabase() {
  if (typeof window !== 'undefined') {
    throw new Error('createAdminSupabase() no puede usarse en el navegador')
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Faltan NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY. Definir en .env.local.'
    )
  }

  return createClient<Database>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}
