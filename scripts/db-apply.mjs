#!/usr/bin/env node
// Aplica todas las migraciones de supabase/migrations/*.sql en orden alfabético.
// Requiere SUPABASE_DB_URL en el entorno (cargado vía `node --env-file=.env.local`).

import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))
const migrationsDir = join(__dirname, '..', 'supabase', 'migrations')

const DB_URL = process.env.SUPABASE_DB_URL
if (!DB_URL) {
  console.error('✗ SUPABASE_DB_URL no está definido.')
  console.error('  Configurarlo en .env.local. Formato:')
  console.error('  postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres')
  process.exit(1)
}

const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .sort()

if (files.length === 0) {
  console.error('✗ No hay migraciones en supabase/migrations/')
  process.exit(1)
}

const client = new pg.Client({
  connectionString: DB_URL,
  ssl: { rejectUnauthorized: false }
})

try {
  await client.connect()
  console.log(`▶ Aplicando ${files.length} migración(es)…`)
  for (const f of files) {
    const sql = readFileSync(join(migrationsDir, f), 'utf8')
    process.stdout.write(`  • ${f} … `)
    await client.query(sql)
    console.log('✓')
  }
  console.log('✓ Migraciones aplicadas correctamente')
} catch (err) {
  console.error('\n✗ Error aplicando migraciones:')
  console.error(err.message ?? err)
  process.exitCode = 1
} finally {
  await client.end()
}
