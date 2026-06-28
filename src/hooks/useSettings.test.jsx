import { describe, it, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useSettings } from './useSettings'

describe('useSettings', () => {
  it('usa "md" como padrão quando não há nada salvo', () => {
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings.textSize).toBe('md')
  })

  it('atualiza e persiste o tamanho do texto', () => {
    const { result } = renderHook(() => useSettings())
    act(() => result.current.setTextSize('lg'))
    expect(result.current.settings.textSize).toBe('lg')
    expect(JSON.parse(localStorage.getItem('santos_settings')).textSize).toBe('lg')
  })

  it('lê o valor previamente persistido no localStorage', () => {
    localStorage.setItem('santos_settings', JSON.stringify({ textSize: 'sm' }))
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings.textSize).toBe('sm')
  })
})
