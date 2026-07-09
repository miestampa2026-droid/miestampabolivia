#!/usr/bin/env node
// Carga supabase/seed.sql en la base de datos.
// Requiere SUPABASE_DB_URL en el entorno (cargado vía `node --env-file=.env.local`).
//
// ⚠️ DESTRUCTIVO: seed.sql borra y recarga orders, order_items y todo el
// catálogo (products, categories, designs, shipping_zones). SOLO usar en
// desarrollo local con datos de prueba. Para cargar/actualizar catálogo
// sin tocar pedidos ni clientes, usar scripts/db-seed-catalog.mjs.
//
// Este proyecto usa UN solo proyecto Supabase (no hay staging/prod
// separados), así que "es producción" no se puede detectar por URL —
// lo único confiable es preguntar: ¿ya hay pedidos o clientes reales
// en esta base? Si los hay, o si NODE_ENV/SEED_ENV están marcados como
// production, este script se niega a correr salvo que se pase
// --force-i-know-what-im-doing.

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))
const seedFile = join(__dirname, '..', 'supabase', 'seed.sql')

const FORCE_FLAG = '--force-i-know-what-im-doing'
const forced = process.argv.includes(FORCE_FLAG)

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

  const envMarked = process.env.NODE_ENV === 'production' || process.env.SEED_ENV === 'production'

  const { rows: existing } = await client.query(`
    select
      (select count(*)::int from public.orders) as orders,
      (select count(*)::int from public.customers) as customers
  `)
  const { orders: ordersCount, customers: customersCount } = existing[0]
  const hasRealData = ordersCount > 0 || customersCount > 0

  if ((hasRealData || envMarked) && !forced) {
    console.error('✗ Este script BORRA todos los pedidos, clientes y el catálogo antes de recargar datos de prueba.')
    if (hasRealData) {
      console.error(`  Se encontraron ${ordersCount} pedido(s) y ${customersCount} cliente(s) en la base — se perderían.`)
    }
    if (envMarked) {
      console.error('  NODE_ENV o SEED_ENV está marcado como "production".')
    }
    console.error('')
    console.error('  ¿Solo querés cargar/actualizar el catálogo (productos, categorías, diseños,')
    console.error('  zonas de envío) sin tocar pedidos ni clientes? Usá en su lugar:')
    console.error('    node --env-file=.env.local scripts/db-seed-catalog.mjs')
    console.error('')
    console.error(`  Si de verdad querés borrar TODO (pedidos y clientes incluidos), volvé a correr:`)
    console.error(`    node --env-file=.env.local scripts/db-seed.mjs ${FORCE_FLAG}`)
    process.exitCode = 1
  } else {
    console.log('▶ Cargando seed.sql…')
    await client.query(sql)

    const { rows: counts } = await client.query(`
      select 'products_categories' as t, count(*)::int as n from public.products_categories
      union all select 'products', count(*)::int from public.products
      union all select 'product_variants', count(*)::int from public.product_variants
      union all select 'designs', count(*)::int from public.designs
      union all select 'shipping_zones', count(*)::int from public.shipping_zones
      union all select 'orders', count(*)::int from public.orders
      order by t;
    `)
    console.log('✓ Seed cargado:')
    for (const r of counts) console.log(`  • ${r.t}: ${r.n}`)
  }
} catch (err) {
  console.error('\n✗ Error cargando seed:')
  console.error(err.message ?? err)
  process.exitCode = 1
} finally {
  await client.end()
}
