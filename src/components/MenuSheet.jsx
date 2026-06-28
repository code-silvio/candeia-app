import { C } from '../theme/tokens'
import { THEME_META, THEME_ORDER } from '../data/saints'
import { Sheet, Grabber, CloseBtn } from './Sheet'

const TEXT_SIZE_OPTIONS = [
  { v: 'sm', preview: '16px' },
  { v: 'md', preview: '21px' },
  { v: 'lg', preview: '27px' },
]

const labelStyle = {
  fontFamily: 'Mulish', fontSize: 10, fontWeight: 700,
  letterSpacing: '0.16em', textTransform: 'uppercase',
  color: C.goldLabel, marginBottom: 14,
}

/** Sheet de menu: filtro por tema + tamanho do texto. */
export default function MenuSheet({ selectedTheme, onSelectTheme, textSize, onSelectTextSize, onClose }) {
  return (
    <Sheet onBackdrop={onClose} zIndex={60}>
      <div style={{ padding: '10px 26px 30px', maxHeight: '86vh', overflowY: 'auto' }}>
        <Grabber />
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 22 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: C.wine }}>Menu</h2>
          <CloseBtn onClose={onClose} />
        </div>

        {/* Filtro por tema */}
        <div style={{ marginBottom: 26 }}>
          <div style={labelStyle}>Filtrar por tema</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
            {THEME_ORDER.map((v) => {
              const active = selectedTheme === v
              return (
                <button
                  key={v}
                  onClick={() => onSelectTheme(v)}
                  aria-pressed={active}
                  style={{
                    fontFamily: 'Mulish', fontSize: 13, fontWeight: 500,
                    cursor: 'pointer', padding: '9px 15px', borderRadius: 2,
                    transition: 'all 160ms cubic-bezier(0.2,0.8,0.2,1)',
                    color: active ? C.cream : C.inkSoft,
                    background: active ? C.wine : C.parchment,
                    border: `1px solid ${active ? C.wine : C.goldBorder}`,
                  }}
                >
                  {active ? '✓ ' : ''}{THEME_META[v].label}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(168,139,72,0.24)', margin: '0 0 22px' }} />

        {/* Tamanho do texto */}
        <div style={{ marginBottom: 24 }}>
          <div style={labelStyle}>Tamanho do texto</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {TEXT_SIZE_OPTIONS.map(({ v, preview }) => {
              const active = textSize === v
              return (
                <button
                  key={v}
                  onClick={() => onSelectTextSize(v)}
                  aria-pressed={active}
                  style={{
                    flex: 1,
                    fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                    cursor: 'pointer', padding: '12px 8px', borderRadius: 2,
                    transition: 'all 160ms cubic-bezier(0.2,0.8,0.2,1)',
                    fontSize: preview,
                    color: active ? C.cream : C.inkSoft,
                    background: active ? C.wine : C.parchment,
                    border: `1px solid ${active ? C.wine : C.goldBorder}`,
                  }}
                >
                  Aa
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </Sheet>
  )
}
