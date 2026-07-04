#!/usr/bin/env node
// Verifica que todos los productos tengan mockup_image_url — utilidad de diagnóstico.
import pg from 'pg'

const client = new pg.Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false }
})

await client.connect()
const { rows } = await client.query(`
  select name, mockup_image_url
  from public.products
  order by (mockup_image_url is null) desc, name;
`)
for (const r of rows) {
  console.log(`${r.mockup_image_url ? '✓' : '✗ NULL'}  ${r.name}${r.mockup_image_url ? '  → ' + r.mockup_image_url.split('/').pop() : ''}`)
}
await client.end()
