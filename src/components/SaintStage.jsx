import { C } from '../theme/tokens'
import ThemeIcon from './ThemeIcon'

/**
 * Área de imagem em tela cheia (tocável/arrastável) com header sobreposto.
 * `imageRef` aponta para a camada animada; `handlers` são os gestos do carousel.
 */
export default function SaintStage({ saint, iconKey, imageRef, handlers }) {
  return (
    <div
      {...handlers}
      style={{
        position: 'relative', flex: 1, minHeight: 0,
        cursor: 'pointer', overflow: 'hidden',
        background: '#3e1620', touchAction: 'none',
      }}
    >
      {/* Camada de fundo (animada na navegação) */}
      <div
        ref={imageRef}
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(125% 95% at 50% 28%, #7a3a40 0%, #5e2230 46%, #3e1620 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'vmFadeIn 360ms cubic-bezier(0.2,0.8,0.2,1)',
        }}
      >
        {saint.image ? (
          <img
            src={saint.image}
            alt={saint.name}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center 38%',
            }}
          />
        ) : (
          <svg width="150" height="216" viewBox="0 0 150 216" fill="none" style={{ opacity: 0.9 }}>
            <circle cx="75" cy="66" r="40" stroke="#d9c081" strokeWidth="1.2" opacity="0.85" />
            <circle cx="75" cy="66" r="54" stroke="#d9c081" strokeWidth="0.6" opacity="0.4" />
            <line x1="75" y1="98" x2="75" y2="190" stroke="#d9c081" strokeWidth="1.2" opacity="0.85" />
            <line x1="45" y1="132" x2="105" y2="132" stroke="#d9c081" strokeWidth="1.2" opacity="0.85" />
          </svg>
        )}
      </div>

      {/* Scrim superior para legibilidade do header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 170,
        background: 'linear-gradient(180deg, rgba(40,16,24,0.55) 0%, rgba(40,16,24,0) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Header: nome + ícone do tema */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '46px 26px 16px', pointerEvents: 'none',
      }}>
        <div style={{ position: 'absolute', top: 44, right: 24, lineHeight: 1 }}>
          <ThemeIcon iconKey={iconKey} />
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 23, fontWeight: 600, color: C.cream,
          lineHeight: 1.16, marginTop: 4, paddingRight: 40,
        }}>
          {saint.name}
        </div>
      </div>
    </div>
  )
}
