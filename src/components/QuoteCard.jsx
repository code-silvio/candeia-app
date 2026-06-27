import { C } from '../theme/tokens'
import { THEME_META } from '../data/saints'

/** Cartão de citação fixo abaixo da imagem, com marca e ações. */
export default function QuoteCard({ saint, quoteSize, quoteRef, onInfo, onShare, onMenu }) {
  return (
    <div
      ref={quoteRef}
      style={{
        background: C.parchment,
        padding: '26px 28px 22px', flexShrink: 0,
        animation: 'vmRise 420ms cubic-bezier(0.2,0.8,0.2,1)',
      }}
    >
      <div style={{
        fontFamily: 'Mulish', fontSize: 10, fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: C.goldLabel, marginBottom: 15,
      }}>
        {THEME_META[saint.themeValue].label}
      </div>

      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: quoteSize, fontWeight: 500, fontStyle: 'italic',
        lineHeight: 1.42, color: C.ink, letterSpacing: '-0.005em',
      }}>
        {saint.quote}
      </p>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 22, paddingTop: 16, borderTop: `1px solid ${C.goldDivider}`,
      }}>
        {/* Marca Candeia */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="17" height="20" viewBox="0 0 64 64" fill="none" style={{ flexShrink: 0 }}>
            <path d="M32 12 C 41 25, 43 34, 32 45 C 21 34, 23 25, 32 12 Z" stroke={C.clay} strokeWidth="2.6" strokeLinejoin="round" />
            <path d="M24 52 q8 7 16 0" stroke={C.clay} strokeWidth="2.6" strokeLinecap="round" />
          </svg>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 19, fontWeight: 600, color: C.wine, lineHeight: 1,
          }}>Candeia</span>
        </div>

        {/* Ações */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <button
            onClick={(e) => { e.stopPropagation(); onInfo() }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: C.goldDeep }}
            aria-label="Fonte da citação"
          >
            <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7.4" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10 9v4.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="10" cy="6.5" r="0.95" fill="currentColor" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onShare() }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: C.goldDeep }}
            aria-label="Compartilhar"
          >
            <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
              <path d="M10 13V3.2M10 3.2 6.6 6.6M10 3.2l3.4 3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 11v4.6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMenu() }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: C.goldDeep }}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="4" cy="10" r="1.7" fill="currentColor" />
              <circle cx="10" cy="10" r="1.7" fill="currentColor" />
              <circle cx="16" cy="10" r="1.7" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
