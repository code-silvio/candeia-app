import { C } from '../theme/tokens'
import { Sheet, Grabber, CloseBtn } from './Sheet'

/** Sheet de compartilhamento: pré-visualização do card + ações. */
export default function ShareSheet({ shareImg, onShareNative, onDownload, onClose }) {
  return (
    <Sheet onBackdrop={onClose} zIndex={80}>
      <div style={{ padding: '10px 26px 30px' }}>
        <Grabber />
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: C.wine }}>Compartilhar</h2>
          <CloseBtn onClose={onClose} />
        </div>
        {shareImg && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
            <img
              src={shareImg} alt="Prévia do card de compartilhamento"
              style={{ width: '60%', borderRadius: 4, boxShadow: '0 14px 34px -12px rgba(46,36,25,0.55)' }}
            />
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onShareNative}
            style={{
              flex: 1, fontFamily: 'Mulish', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer', padding: 15, borderRadius: 2,
              color: '#fff', background: C.wine, border: `1.5px solid ${C.wine}`,
            }}
          >
            Compartilhar
          </button>
          <button
            onClick={onDownload}
            style={{
              flex: 1, fontFamily: 'Mulish', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer', padding: 15, borderRadius: 2,
              color: C.goldDeep, background: 'transparent', border: '1.5px solid #a98b48',
            }}
          >
            Baixar imagem
          </button>
        </div>
      </div>
    </Sheet>
  )
}
