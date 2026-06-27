import { createClient } from '@supabase/supabase-js'

// ── Cliente Supabase (frontend, leitura pública) ──────────────────────────────
// Usa a chave ANON, que é pública por design — a segurança vem da RLS na tabela
// `saints` (somente SELECT para anon), não de esconder a chave. Sem login, então
// desativamos a persistência de sessão.

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null
