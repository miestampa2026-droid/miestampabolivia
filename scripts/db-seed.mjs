#!/usr/bin/env node
// Carga supabase/seed.sql en la base de datos.
// Requiere SUPABASE_DB_URL en el entorno (cargado vía `node --env-file=.env.local`).

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))
const seedFile = join(__dirname, '..', 'supabase', 'seed.sql')

const DB_URL = process.env.SUPABASE_DB_URL
if (!DB_URL) {
  console.error('✗ SUPABASE_DB_URL no está definido. Configurarlo en .env.local.')
  process.exit(1)
}

const sql = readFileSync(seedFile, 'utf8')
const client = new pg.Client({
  connectionString: DB_URL,
  ssl: { rejectUnauthorized: false }
})

try {
  await client.connect()
  console.log('▶ Cargando seed.sql…')
  await client.query(sql)

  const { rows: counts } = await client.query(`
    select 'products_categories' as t, count(*)::int as n from public.products_categories
    union all select 'products', count(*)::int from public.products
    union all select 'product_variants', count(*)::int from public.product_variants
    union all select 'designs', count(*)::int from public.designs
    union all select 'shipping_zones', count(*)::int from public.shipping_zones
    order by t;
  `)
  console.log('✓ Seed cargado:')
  for (const r of counts) console.log(`  • ${r.t}: ${r.n}`)
} catch (err) {
  console.error('\n✗ Error cargando seed:')
  console.error(err.message ?? err)
  process.exitCode = 1
} finally {
  await client.end()
}
