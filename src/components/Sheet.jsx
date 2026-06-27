import { C } from '../theme/tokens'

/** Bottom sheet modal genérico (overlay + painel deslizante). */
export function Sheet({ onBackdrop, children, zIndex = 60 }) {
  return (
    <div
      onClick={onBackdrop}
      style={{
        position: 'absolute', inset: 0, zIndex,
        display: 'flex', alignItems: 'flex-end',
        background: C.overlayBg,
        animation: 'vmOverlay 220ms ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', background: C.parchmentLight,
          borderRadius: '22px 22px 0 0',
          animation: 'vmSheetUp 320ms cubic-bezier(0.2,0.8,0.2,1)',
          boxShadow: '0 -10px 40px -12px rgba(46,36,25,0.4)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

/** Alça visual no topo do sheet. */
export function Grabber() {
  return <div style={{ width: 38, height: 4, borderRadius: 2, background: C.sheetGrab, margin: '0 auto 18px' }} />
}

/** Botão de fechar (✕). */
export function CloseBtn({ onClose }) {
  return (
    <button
      onClick={onClose}
      aria-label="Fechar"
      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: C.closeBtn, lineHeight: 1 }}
    >✕</button>
  )
}
