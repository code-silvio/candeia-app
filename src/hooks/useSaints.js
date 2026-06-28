import { useEffect, useState } from 'react'
import { SEED_SAINTS } from '../data/saints'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const CACHE_KEY = 'candeia_saints_cache'

// Linha do Postgres → formato usado pela UI.
function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    themeValue: row.theme_value,
    image: row.image_url || undefined,
    quote: row.quote,
    source: row.source || {},
  }
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) && parsed.length ? parsed : null
  } catch {
    return null
  }
}

function writeCache(saints) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(saints)) } catch { /* storage cheio/indisponível */ }
}

/**
 * Fonte de santos da aplicação.
 * Estratégia offline-first: renderiza imediatamente com cache (ou seed) e, se o
 * Supabase estiver configurado, busca a versão mais recente em segundo plano e
 * atualiza + persiste em cache. Os ids batem com o seed, então a troca é suave.
 *
 * @returns {{ saints: object[], loading: boolean, error: Error | null }}
 */
export function useSaints() {
  const [saints, setSaints] = useState(() => readCache() ?? SEED_SAINTS)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let cancelled = false

    supabase
      .from('saints')
      .select('*')
      .order('id', { ascending: true })
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) { setError(err); setLoading(false); return }
        if (data?.length) {
          const mapped = data.map(mapRow)
          setSaints(mapped)
          writeCache(mapped)
        }
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return { saints, loading, error }
}
