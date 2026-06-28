// Validação pura do seed (sem efeitos colaterais) — usada pelo script de seed
// e pelos testes. Retorna uma lista de mensagens de erro (vazia = válido).

export const THEME_VALUES = ['eucaristia', 'missa', 'liturgia', 'oracao', 'sacramentos', 'virtudes']

export function validateSeed(seed) {
  const errors = []

  if (!Array.isArray(seed) || seed.length === 0) {
    errors.push('seed vazio ou não é uma lista')
    return errors
  }

  const seen = new Set()
  for (const s of seed) {
    if (typeof s.id !== 'number') {
      errors.push(`id ausente/inválido em "${s.name ?? '?'}"`)
    } else if (seen.has(s.id)) {
      errors.push(`id duplicado: ${s.id}`)
    }
    seen.add(s.id)

    if (!s.name) errors.push(`name ausente (id ${s.id})`)
    if (!s.quote) errors.push(`quote ausente (id ${s.id})`)
    if (!THEME_VALUES.includes(s.themeValue)) {
      errors.push(`themeValue desconhecido "${s.themeValue}" (id ${s.id})`)
    }
  }

  return errors
}
