// ── Seed local da tabela `saints` ─────────────────────────────────────────────
// Lê seeds/saints.json e faz upsert no Supabase usando a SERVICE_ROLE key.
// Roda SOMENTE na sua máquina — a service_role ignora RLS e nunca deve ir para
// o frontend nem para o git.
//
// Uso:
//   1. Preencha .env (veja .env.example) com SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY
//   2. npm run seed                 (faz upsert dos santos do seeds/saints.json)
//
// Node 20.6+ carrega o .env via flag --env-file (já embutida no script npm).

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { validateSeed } from './validateSeed.js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

function die(msg) {
  console.error(`\n✗ ${msg}\n`)
  process.exit(1)
}

if (!SUPABASE_URL) die('Falta SUPABASE_URL no ambiente (.env).')
if (!SERVICE_ROLE) die('Falta SUPABASE_SERVICE_ROLE_KEY no ambiente (.env).')

const __dirname = dirname(fileURLToPath(import.meta.url))
const seedPath = resolve(__dirname, '../seeds/saints.json')

const seed = JSON.parse(await readFile(seedPath, 'utf8'))
if (!Array.isArray(seed) || seed.length === 0) die('seeds/saints.json vazio ou inválido.')

// Validação leve antes de escrever.
const errors = validateSeed(seed)
if (errors.length) die('Erros de validação:\n  - ' + errors.join('\n  - '))

// seed (camelCase, formato do app) → linha do Postgres (snake_case).
const rows = seed.map((s) => ({
  id: s.id,
  name: s.name,
  age: s.age ?? null,
  theme_value: s.themeValue,
  image_url: s.image ?? null,
  quote: s.quote,
  source: s.source ?? {},
  updated_at: new Date().toISOString(),
}))

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
})

console.log(`→ Upsert de ${rows.length} santos em ${SUPABASE_URL} ...`)

const { error } = await supabase.from('saints').upsert(rows, { onConflict: 'id' })
if (error) die(`Falha no upsert: ${error.message}`)

const { count } = await supabase.from('saints').select('*', { count: 'exact', head: true })

console.log(`✓ Seed concluído. Total de santos na tabela: ${count ?? '?'}\n`)
