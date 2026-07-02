import { C } from '../theme/tokens'

/**
 * Tela de abertura exibida ao carregar o app.
 * Qualquer toque (ou tecla) avança para as páginas dos santos via `onStart`.
 */
export default function SplashScreen({ onStart }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onStart}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onStart() }}
      style={{
        position: 'absolute', inset: 0, zIndex: 50,
        cursor: 'pointer', userSelect: 'none',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '0 32px',
        textAlign: 'center',
        background: 'radial-gradient(120% 90% at 50% 34%, #7a3a40 0%, #5e2230 44%, #3e1620 100%)',
        animation: 'vmFadeIn 500ms cubic-bezier(0.2,0.8,0.2,1)',
      }}
    >
      {/* Glifo da candeia */}
      <svg
        width={72} height={82} viewBox="0 0 64 64" fill="none"
        stroke="#d6b25e" strokeLinejoin="round" strokeLinecap="round"
        style={{ marginBottom: 40 }}
      >
        <path d="M32 12 C 41 25, 43 34, 32 45 C 21 34, 23 25, 32 12 Z" strokeWidth="1.6" />
        <path d="M32 24 C 37 30, 38 35, 32 41 C 26 35, 27 30, 32 24 Z" strokeWidth="1.3" opacity="0.55" />
        <path d="M24 52 q8 7 16 0" strokeWidth="1.6" />
      </svg>

      {/* Título */}
      <h1 style={{
        margin: 0,
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 58, fontWeight: 600, letterSpacing: '0.02em',
        color: C.cream, lineHeight: 1,
      }}>
        Candeia
      </h1>

      {/* Divisor dourado */}
      <div style={{
        width: 56, height: 1, margin: '24px 0 22px',
        background: C.goldBorder,
      }} />

      {/* Subtítulo */}
      <p style={{
        margin: 0, maxWidth: 260,
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: 'italic', fontSize: 21, fontWeight: 400,
        color: 'rgba(247,238,215,0.78)', lineHeight: 1.4,
      }}>
        Palavras dos santos que iluminam o seu dia.
      </p>

      {/* Chamada de ação */}
      <div style={{
        position: 'absolute', bottom: 40, left: 0, right: 0,
        fontFamily: "'Mulish', sans-serif",
        fontSize: 12, fontWeight: 500, letterSpacing: '0.28em',
        color: C.goldLabel, textTransform: 'uppercase',
        animation: 'vmPulse 2.4s ease-in-out infinite',
      }}>
        Toque para começar
      </div>
    </div>
  )
}
