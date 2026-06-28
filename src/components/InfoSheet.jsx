import { C } from '../theme/tokens'
import { Sheet, Grabber, CloseBtn } from './Sheet'

function buildRows(saint) {
  const src = saint.source || {}
  return [
    { label: 'Período', value: saint.age },
    { label: 'Autor', value: src.author },
    { label: 'Trecho', value: src.book },
    { label: 'Página', value: src.page },
    { label: 'Editora', value: src.publisher },
    { label: 'Edição', value: src.edition },
  ].filter((r) => r.value)
}

/** Sheet de fonte/referência bibliográfica da citação. */
export default function InfoSheet({ saint, onClose }) {
  const rows = buildRows(saint)
  return (
    <Sheet onBackdrop={onClose} zIndex={85}>
      <div style={{ padding: '10px 28px 32px' }}>
        <Grabber />
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontFamily: 'Mulish', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.goldLabel }}>
            Fonte da citação
          </div>
          <CloseBtn onClose={onClose} />
        </div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 25, fontWeight: 600, fontStyle: 'italic',
          color: C.wine, lineHeight: 1.16, marginBottom: 20,
        }}>
          {saint.source?.work}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: C.goldDivider }}>
          {rows.map((r) => (
            <div
              key={r.label}
              style={{ display: 'flex', alignItems: 'baseline', gap: 14, background: C.parchmentLight, padding: '13px 2px' }}
            >
              <div style={{
                flexShrink: 0, width: 84,
                fontFamily: 'Mulish', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: C.goldLabel,
              }}>
                {r.label}
              </div>
              <div style={{ flex: 1, fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: C.ink, lineHeight: 1.3 }}>
                {r.value}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, fontFamily: 'Mulish', fontSize: 11, color: '#8a7a52', lineHeight: 1.45 }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
            <path d="M5 10.5 8.5 14 15 6" stroke={C.goldDeep} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Referência verificada na obra original.</span>
        </div>
      </div>
    </Sheet>
  )
}
