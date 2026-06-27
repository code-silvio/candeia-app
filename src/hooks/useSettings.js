import { useCallback, useState } from 'react'

const STORAGE_KEY = 'santos_settings'
const DEFAULT_SETTINGS = { textSize: 'md' }

function readSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

/**
 * Preferências do usuário persistidas em localStorage (sem login).
 * Hoje: tamanho do texto. Ponto de extensão para idioma/favoritos.
 */
export function useSettings() {
  const [settings, setSettings] = useState(readSettings)

  const setTextSize = useCallback((textSize) => {
    setSettings((prev) => {
      const next = { ...prev, textSize }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* storage indisponível */ }
      return next
    })
  }, [])

  return { settings, setTextSize }
}
