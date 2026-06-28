import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { SEED_SAINTS } from '../data/saints'

// Holder controlável pelos testes (hoisted p/ ser visível dentro do vi.mock).
const h = vi.hoisted(() => ({ configured: true, response: { data: [], error: null } }))

vi.mock('../lib/supabase', () => ({
  get isSupabaseConfigured() { return h.configured },
  supabase: {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve(h.response),
      }),
    }),
  },
}))

// Importa depois do mock.
const { useSaints } = await import('./useSaints')

const dbRow = {
  id: 99,
  name: 'Santo do Banco',
  age: 'c. 2000',
  theme_value: 'missa',
  image_url: 'https://x.supabase.co/storage/v1/object/public/saints-images/y.png',
  quote: 'Citação do banco.',
  source: { work: 'Obra', author: 'Autor' },
}

describe('useSaints', () => {
  beforeEach(() => {
    h.configured = true
    h.response = { data: [], error: null }
    localStorage.clear()
  })

  it('cai no seed local quando o Supabase não está configurado', () => {
    h.configured = false
    const { result } = renderHook(() => useSaints())
    expect(result.current.saints).toEqual(SEED_SAINTS)
    expect(result.current.loading).toBe(false)
  })

  it('busca do Supabase e mapeia linha → formato da UI', async () => {
    h.response = { data: [dbRow], error: null }
    const { result } = renderHook(() => useSaints())

    await waitFor(() => expect(result.current.loading).toBe(false))

    const saint = result.current.saints[0]
    expect(saint).toMatchObject({
      id: 99,
      name: 'Santo do Banco',
      themeValue: 'missa',
      image: dbRow.image_url,
      quote: 'Citação do banco.',
      source: { work: 'Obra', author: 'Autor' },
    })
  })

  it('persiste o resultado em cache no localStorage', async () => {
    h.response = { data: [dbRow], error: null }
    const { result } = renderHook(() => useSaints())
    await waitFor(() => expect(result.current.saints[0].id).toBe(99))

    const cached = JSON.parse(localStorage.getItem('candeia_saints_cache'))
    expect(cached[0].id).toBe(99)
  })

  it('mantém o seed quando a consulta retorna erro', async () => {
    h.response = { data: null, error: new Error('boom') }
    const { result } = renderHook(() => useSaints())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.saints).toEqual(SEED_SAINTS)
  })
})
