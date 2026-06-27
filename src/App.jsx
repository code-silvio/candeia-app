import { useCallback, useRef, useState } from 'react'
import { SAINTS, THEME_META } from './data/saints'
import { C, QUOTE_SIZE } from './theme/tokens'
import { useSettings } from './hooks/useSettings'
import { useSaintCarousel } from './hooks/useSaintCarousel'
import { buildShareCard } from './lib/shareCard'
import SaintStage from './components/SaintStage'
import QuoteCard from './components/QuoteCard'
import MenuSheet from './components/MenuSheet'
import ShareSheet from './components/ShareSheet'
import InfoSheet from './components/InfoSheet'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [shareImg, setShareImg] = useState(null)

  const { settings, setTextSize } = useSettings()

  const openMenu = useCallback(() => setMenuOpen(true), [])
  const { saint, selectedTheme, selectTheme, imageRef, quoteRef, stageHandlers } =
    useSaintCarousel(SAINTS, openMenu)

  // Card de compartilhamento gerado sob demanda (dataURL p/ preview/download, blob p/ share nativo).
  const shareData = useRef({ dataURL: null, blob: null })

  const handleShare = useCallback(async () => {
    const { dataURL, blob } = await buildShareCard(saint, THEME_META[saint.themeValue].label)
    shareData.current = { dataURL, blob }
    setShareImg(dataURL)
    setShareOpen(true)
  }, [saint])

  const handleDownload = useCallback(() => {
    const { dataURL } = shareData.current
    if (!dataURL) return
    const a = document.createElement('a')
    a.href = dataURL
    a.download = 'candeia-santo.png'
    document.body.appendChild(a); a.click(); a.remove()
  }, [])

  const handleShareNative = useCallback(async () => {
    const { blob } = shareData.current
    try {
      if (blob && navigator.canShare) {
        const file = new File([blob], 'candeia-santo.png', { type: 'image/png' })
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Santo do dia — Candeia' })
          return
        }
      }
      if (navigator.share) { await navigator.share({ title: 'Santo do dia — Candeia' }); return }
    } catch { /* usuário cancelou ou share indisponível */ }
    handleDownload()
  }, [handleDownload])

  const quoteSize = QUOTE_SIZE[settings.textSize] || QUOTE_SIZE.md

  return (
    <div style={{
      width: '100%', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#d9d4c8',
    }}>
      {/* Moldura do app (mobile) */}
      <div style={{
        position: 'relative',
        width: '100%', maxWidth: 430,
        height: '100vh', maxHeight: 920,
        background: C.parchment,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 30px 80px -28px rgba(46,36,25,0.55)',
      }}>
        <SaintStage
          saint={saint}
          iconKey={THEME_META[saint.themeValue].icon}
          imageRef={imageRef}
          handlers={stageHandlers}
        />

        <QuoteCard
          saint={saint}
          quoteSize={quoteSize}
          quoteRef={quoteRef}
          onInfo={() => setInfoOpen(true)}
          onShare={handleShare}
          onMenu={() => setMenuOpen(true)}
        />

        {menuOpen && (
          <MenuSheet
            selectedTheme={selectedTheme}
            onSelectTheme={selectTheme}
            textSize={settings.textSize}
            onSelectTextSize={setTextSize}
            onClose={() => setMenuOpen(false)}
          />
        )}

        {shareOpen && (
          <ShareSheet
            shareImg={shareImg}
            onShareNative={handleShareNative}
            onDownload={handleDownload}
            onClose={() => setShareOpen(false)}
          />
        )}

        {infoOpen && (
          <InfoSheet saint={saint} onClose={() => setInfoOpen(false)} />
        )}
      </div>
    </div>
  )
}
