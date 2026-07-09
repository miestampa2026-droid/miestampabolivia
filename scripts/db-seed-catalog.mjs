#!/usr/bin/env node
// Carga/actualiza supabase/catalog-seed.sql — SOLO catálogo (categorías,
// productos, variantes, diseños, zonas de envío). Todo es upsert
// (ON CONFLICT), nunca TRUNCATE: seguro de correr con pedidos y clientes
// reales ya en la base. Nunca toca orders, order_items, customers,
// customer_addresses ni customer_favorites.
// Requiere SUPABASE_DB_URL en el entorno (cargado vía `node --env-file=.env.local`).

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))
const seedFile = join(__dirname, '..', 'supabase', 'catalog-seed.sql')

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

  const { rows: before } = await client.query(`
    select
      (select count(*)::int from public.orders) as orders,
      (select count(*)::int from public.customers) as customers
  `)

  console.log('▶ Cargando catalog-seed.sql (solo catálogo, sin tocar pedidos ni clientes)…')
  await client.query(sql)

  const { rows: counts } = await client.query(`
    select 'products_categories' as t, count(*)::int as n from public.products_categories
    union all select 'products', count(*)::int from public.products
    union all select 'product_variants', count(*)::int from public.product_variants
    union all select 'designs', count(*)::int from public.designs
    union all select 'shipping_zones', count(*)::int from public.shipping_zones
    order by t;
  `)
  console.log('✓ Catálogo actualizado:')
  for (const r of counts) console.log(`  • ${r.t}: ${r.n}`)

  const { rows: after } = await client.query(`
    select
      (select count(*)::int from public.orders) as orders,
      (select count(*)::int from public.customers) as customers
  `)
  const untouched = before[0].orders === after[0].orders && before[0].customers === after[0].customers
  console.log(
    untouched
      ? `✓ orders (${after[0].orders}) y customers (${after[0].customers}) sin cambios, como debe ser.`
      : '✗ ALERTA: orders/customers cambiaron — esto no debería pasar, revisar catalog-seed.sql.'
  )
} catch (err) {
  console.error('\n✗ Error cargando catálogo:')
  console.error(err.message ?? err)
  process.exitCode = 1
} finally {
  await client.end()
}
