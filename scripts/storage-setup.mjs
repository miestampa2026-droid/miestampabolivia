#!/usr/bin/env node
// Crea los buckets de Supabase Storage documentados en supabase/README.md.
// Idempotente: si un bucket ya existe, lo reporta y sigue.
// Requiere NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el entorno
// (cargado vía `node --env-file=.env.local`).

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

const BUCKETS = [
  { name: 'designs', public: true },
  { name: 'uploads', public: false },
  { name: 'previews', public: true },
  { name: 'payment-proofs', public: false },
  { name: 'mockups', public: true }
]

console.log(`▶ Configurando ${BUCKETS.length} bucket(s) de Storage…`)

for (const bucket of BUCKETS) {
  process.stdout.write(`  • ${bucket.name} (${bucket.public ? 'público' : 'privado'}) … `)
  const { error } = await supabase.storage.createBucket(bucket.name, { public: bucket.public })

  if (error) {
    if (error.message?.toLowerCase().includes('already exists')) {
      console.log('ya existía ✓')
    } else {
      console.log('✗')
      console.error(`    ${error.message}`)
      process.exitCode = 1
    }
  } else {
    console.log('creado ✓')
  }
}

console.log('✓ Storage configurado')
