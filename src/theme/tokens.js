// ── Design tokens ─────────────────────────────────────────────────────────────
// Paleta do design system "Catholic Devotional" (pergaminho / vinho / dourado).
// Fonte única de cor para componentes — não usar hex solto na UI.

export const C = {
  wine:           '#5e2230',
  parchment:      '#F2E9D2',
  parchmentLight: '#F7F0DD',
  cream:          '#f7eed7',
  ink:            '#2e2419',
  inkSoft:        '#5b513c',
  goldDeep:       '#8a6d2f',
  goldLabel:      '#a07c34',
  goldDivider:    'rgba(168,139,72,0.28)',
  goldBorder:     'rgba(168,139,72,0.45)',
  clay:           '#c6713e',
  sheetGrab:      '#d8c89a',
  closeBtn:       '#b09a6e',
  overlayBg:      'rgba(40,16,24,0.42)',
}

// Curva de easing padrão usada em todas as transições/animações.
export const EASE = 'cubic-bezier(0.2,0.8,0.2,1)'

// Tamanho da citação por preferência do usuário.
export const QUOTE_SIZE = { sm: '20px', md: '23px', lg: '28px' }
