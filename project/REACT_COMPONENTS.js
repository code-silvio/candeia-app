/**
 * Catholic Devotional App — Reusable React Components
 * 
 * These are example components extracted from the prototype.
 * Use them as templates for your own implementation.
 */

// ============================================================================
// 1. Header Component
// ============================================================================

export const SaintHeader = ({ saint, eyebrow }) => {
  return (
    <div style={{
      padding: '12px 16px',
      background: 'var(--parchment)',
      borderBottom: '1px solid var(--parchment-deep)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexShrink: 0,
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{
          fontFamily: 'Mulish, sans-serif',
          fontSize: '9px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--wine)',
        }}>
          {eyebrow}
        </div>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '14px',
          fontWeight: 400,
          color: 'var(--ink)',
        }}>
          {saint.name}
        </div>
      </div>
      <div style={{ fontSize: '20px' }}>
        {saint.icon}
      </div>
    </div>
  );
};

// ============================================================================
// 2. Image Container Component (with fade transition)
// ============================================================================

export const ImageContainer = ({ saint, onTap, fadeState }) => {
  return (
    <div
      onClick={onTap}
      style={{
        width: '100%',
        flex: 1,
        background: 'radial-gradient(125% 95% at 50% 28%, #7a3a40 0%, #5e2230 46%, #3e1620 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'opacity 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        opacity: fadeState === 'fade-out' ? 0 : 1,
      }}
    >
      {/* If using backend image: */}
      {saint.image ? (
        <img
          src={saint.image}
          alt={saint.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        /* Fallback to emoji placeholder: */
        <div style={{ fontSize: '80px', opacity: 0.8 }}>
          {saint.icon}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 3. Quote Card Component
// ============================================================================

export const QuoteCard = ({ saint, tapHint }) => {
  return (
    <div style={{
      padding: '20px 16px 24px',
      background: 'var(--parchment-light)',
      borderTop: '1px solid var(--parchment-deep)',
      flexShrink: 0,
      maxHeight: '200px',
      overflowY: 'auto',
      animation: 'slideUp 300ms cubic-bezier(0.2, 0.8, 0.2, 1)',
    }}>
      <div style={{
        display: 'inline-block',
        background: 'var(--parchment-deep)',
        padding: '4px 12px',
        borderRadius: '2px',
        fontSize: '10px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--wine)',
        marginBottom: '12px',
      }}>
        {saint.theme}
      </div>

      <p style={{
        fontFamily: 'Mulish, sans-serif',
        fontSize: '15px',
        fontWeight: 300,
        lineHeight: 1.6,
        color: 'var(--ink)',
        marginBottom: '12px',
        paddingLeft: '12px',
        borderLeft: '3px solid var(--gold)',
        fontStyle: 'italic',
      }}>
        "{saint.quote}"
      </p>

      <p style={{
        fontSize: '11px',
        color: 'var(--gold-deep)',
        textAlign: 'center',
      }}>
        {tapHint}
      </p>
    </div>
  );
};

// ============================================================================
// 4. Double-Tap Menu Component
// ============================================================================

export const DoubleTabMenu = ({
  isOpen,
  themes,
  selectedTheme,
  onSelectTheme,
  settings,
  onSetTextSize,
  onSetLanguage,
  isFavorite,
  onToggleFavorite,
  onClose,
  onOverlayClick,
  stopPropagation,
}) => {
  return (
    <div
      onClick={onOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(11, 21, 39, 0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 100,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'all' : 'none',
        transition: 'opacity 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      <div
        onClick={stopPropagation}
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'var(--parchment-light)',
          borderRadius: '16px 16px 0 0',
          padding: '24px',
          maxHeight: '80vh',
          overflowY: 'auto',
          animation: isOpen ? 'slideUpMenu 300ms cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--parchment-deep)',
        }}>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '18px',
            color: 'var(--ink)',
            margin: 0,
          }}>
            Menu
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--gold-deep)',
              transition: 'color 160ms',
              padding: 0,
            }}
            onMouseOver={(e) => e.target.style.color = 'var(--wine)'}
            onMouseOut={(e) => e.target.style.color = 'var(--gold-deep)'}
          >
            ✕
          </button>
        </div>

        {/* Theme Filter Section */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--wine)',
            marginBottom: '12px',
          }}>
            Filtrar por Tema
          </label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '12px',
          }}>
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => onSelectTheme(theme.value)}
                style={{
                  padding: '8px 14px',
                  background: selectedTheme === theme.value ? 'var(--gold)' : 'var(--parchment-deep)',
                  border: selectedTheme === theme.value ? '1px solid var(--gold)' : '1px solid var(--ink-soft)',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 160ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                  color: selectedTheme === theme.value ? 'var(--parchment-light)' : 'var(--ink-soft)',
                }}
                onMouseOver={(e) => {
                  if (selectedTheme !== theme.value) {
                    e.target.style.borderColor = 'var(--gold)';
                    e.target.style.color = 'var(--gold)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedTheme !== theme.value) {
                    e.target.style.borderColor = 'var(--ink-soft)';
                    e.target.style.color = 'var(--ink-soft)';
                  }
                }}
              >
                {selectedTheme === theme.value ? '✓ ' : ''}{theme.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--parchment-deep)', margin: '16px 0' }} />

        {/* Text Size Setting */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--wine)',
            marginBottom: '12px',
          }}>
            Tamanho do Texto
          </label>
          {['sm', 'md', 'lg'].map((size) => (
            <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0' }}>
              <input
                type="radio"
                id={`text-${size}`}
                name="textSize"
                value={size}
                checked={settings.textSize === size}
                onChange={() => onSetTextSize(size)}
                style={{ cursor: 'pointer', accentColor: 'var(--wine)' }}
              />
              <label htmlFor={`text-${size}`} style={{
                fontSize: '14px',
                fontWeight: 400,
                color: 'var(--ink-soft)',
                cursor: 'pointer',
                margin: 0,
              }}>
                {size === 'sm' ? 'Pequeno' : size === 'md' ? 'Médio' : 'Grande'}
              </label>
            </div>
          ))}
        </div>

        <div style={{ height: '1px', background: 'var(--parchment-deep)', margin: '16px 0' }} />

        {/* Language Setting */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--wine)',
            marginBottom: '12px',
          }}>
            Idioma
          </label>
          {[
            { value: 'pt', label: 'Português (BR)' },
            { value: 'en', label: 'English' },
          ].map((lang) => (
            <div key={lang.value} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0' }}>
              <input
                type="radio"
                id={`lang-${lang.value}`}
                name="language"
                value={lang.value}
                checked={settings.language === lang.value}
                onChange={() => onSetLanguage(lang.value)}
                style={{ cursor: 'pointer', accentColor: 'var(--wine)' }}
              />
              <label htmlFor={`lang-${lang.value}`} style={{
                fontSize: '14px',
                fontWeight: 400,
                color: 'var(--ink-soft)',
                cursor: 'pointer',
                margin: 0,
              }}>
                {lang.label}
              </label>
            </div>
          ))}
        </div>

        <div style={{ height: '1px', background: 'var(--parchment-deep)', margin: '16px 0' }} />

        {/* Favorite Button */}
        <button
          onClick={onToggleFavorite}
          style={{
            width: '100%',
            padding: '14px',
            background: isFavorite ? 'var(--gold)' : 'transparent',
            border: `2px solid var(--gold)`,
            borderRadius: '4px',
            color: isFavorite ? 'var(--parchment-light)' : 'var(--gold)',
            fontFamily: 'Mulish, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all 160ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            marginBottom: '12px',
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'var(--gold)';
            e.target.style.color = 'var(--parchment-light)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = isFavorite ? 'var(--gold)' : 'transparent';
            e.target.style.color = isFavorite ? 'var(--parchment-light)' : 'var(--gold)';
          }}
        >
          {isFavorite ? '★ Remover de Favoritos' : '☆ Adicionar aos Favoritos'}
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '14px',
            background: 'var(--wine)',
            border: 'none',
            borderRadius: '4px',
            color: 'var(--parchment-light)',
            fontFamily: 'Mulish, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all 160ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'var(--wine-light)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'var(--wine)';
          }}
        >
          Fechar Menu
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 5. Custom Hooks for App Logic
// ============================================================================

export const useDoubleTap = (onSingleTap, onDoubleTap, delay = 300) => {
  const [tapCount, setTapCount] = React.useState(0);
  const timeoutRef = React.useRef(null);

  const handleTap = () => {
    clearTimeout(timeoutRef.current);
    setTapCount((prev) => {
      const newCount = prev + 1;

      if (newCount === 1) {
        timeoutRef.current = setTimeout(() => {
          onSingleTap();
          setTapCount(0);
        }, delay);
      } else if (newCount === 2) {
        onDoubleTap();
        setTapCount(0);
      }

      return newCount;
    });
  };

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return handleTap;
};

// ============================================================================
// 6. Persistence Hook
// ============================================================================

export const usePersistentState = (key, initialValue) => {
  const [state, setState] = React.useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return initialValue;
    }
  });

  const setPersistentState = (value) => {
    try {
      setState(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
    }
  };

  return [state, setPersistentState];
};

// ============================================================================
// 7. Example Usage in a React Component
// ============================================================================

/*
import React from 'react';

export const CatholicApp = () => {
  const [saints, setSaints] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedTheme, setSelectedTheme] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [favorites, setFavorites] = usePersistentState('catholicApp_favorites', []);
  const [settings, setSettings] = usePersistentState('catholicApp_settings', {
    textSize: 'md',
    language: 'pt',
  });

  // Fetch saints from backend
  React.useEffect(() => {
    const fetchSaints = async () => {
      try {
        const response = await fetch('/api/saints');
        const data = await response.json();
        setSaints(data.saints);
      } catch (error) {
        console.error('Error fetching saints:', error);
      }
    };

    fetchSaints();
  }, []);

  const filteredSaints = selectedTheme
    ? saints.filter((s) => s.themeValue === selectedTheme)
    : saints;

  const currentSaint = filteredSaints[currentIndex] || saints[0];

  const handleSingleTap = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredSaints.length);
  };

  const handleDoubleTap = () => {
    setMenuOpen(true);
  };

  const handleTap = useDoubleTap(handleSingleTap, handleDoubleTap);

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SaintHeader saint={currentSaint} eyebrow="SANTO DO DIA" />
      <ImageContainer saint={currentSaint} onTap={handleTap} />
      <QuoteCard saint={currentSaint} tapHint="Toque para próxima · Duplo toque para menu" />
      <DoubleTabMenu
        isOpen={menuOpen}
        themes={[...]}
        selectedTheme={selectedTheme}
        onSelectTheme={setSelectedTheme}
        settings={settings}
        onSetTextSize={(size) => setSettings({ ...settings, textSize: size })}
        onSetLanguage={(lang) => setSettings({ ...settings, language: lang })}
        isFavorite={favorites.includes(currentSaint.id)}
        onToggleFavorite={() => {
          setFavorites(
            favorites.includes(currentSaint.id)
              ? favorites.filter((id) => id !== currentSaint.id)
              : [...favorites, currentSaint.id]
          );
        }}
        onClose={() => setMenuOpen(false)}
        onOverlayClick={() => setMenuOpen(false)}
        stopPropagation={(e) => e.stopPropagation()}
      />
    </div>
  );
};
*/

export default {
  SaintHeader,
  ImageContainer,
  QuoteCard,
  DoubleTabMenu,
  useDoubleTap,
  usePersistentState,
};
