#!/usr/bin/env node
// Lista buckets y archivos de Supabase Storage — utilidad de diagnóstico.
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('✗ Faltan NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const { data: buckets, error } = await supabase.storage.listBuckets()
if (error) throw error

console.log(
  'Buckets:',
  buckets.map((b) => `${b.name} (${b.public ? 'público' : 'privado'})`).join(', ')
)

for (const b of buckets) {
  const { data: files, error: listErr } = await supabase.storage.from(b.name).list('', { limit: 100 })
  if (listErr) {
    console.log(`  ${b.name}: error ${listErr.message}`)
    continue
  }
  console.log(`\n[${b.name}]`)
  for (const f of files ?? []) {
    const size = f.metadata?.size ? ` (${Math.round(f.metadata.size / 1024)} KB)` : ''
    console.log(`  - ${f.name}${size}`)
  }
  if (!files?.length) console.log('  (vacío)')
}
