import { describe, it, expect } from 'vitest'
import { validateSeed } from './validateSeed.js'

const ok = (over = {}) => ({ id: 1, name: 'Santo X', themeValue: 'oracao', quote: 'Reze.', ...over })

describe('validateSeed', () => {
  it('aceita um seed válido', () => {
    expect(validateSeed([ok(), ok({ id: 2 })])).toEqual([])
  })

  it('rejeita seed vazio ou não-lista', () => {
    expect(validateSeed([])).toHaveLength(1)
    expect(validateSeed(null)).toHaveLength(1)
  })

  it('detecta id duplicado', () => {
    const errors = validateSeed([ok({ id: 1 }), ok({ id: 1 })])
    expect(errors.some((e) => e.includes('id duplicado: 1'))).toBe(true)
  })

  it('exige name e quote', () => {
    const errors = validateSeed([ok({ name: '', quote: '' })])
    expect(errors.some((e) => e.includes('name ausente'))).toBe(true)
    expect(errors.some((e) => e.includes('quote ausente'))).toBe(true)
  })

  it('rejeita themeValue desconhecido', () => {
    const errors = validateSeed([ok({ themeValue: 'inexistente' })])
    expect(errors.some((e) => e.includes('themeValue desconhecido'))).toBe(true)
  })

  it('rejeita id não numérico', () => {
    const errors = validateSeed([ok({ id: 'abc' })])
    expect(errors.some((e) => e.includes('id ausente/inválido'))).toBe(true)
  })
})
