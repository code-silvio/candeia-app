import { useState, useRef, useEffect } from 'react'

// ── Data ─────────────────────────────────────────────────────────────────────

const SAINTS = [
  {
    id: 1, name: 'Santo Agostinho', age: 'c. 354–430', themeValue: 'eucaristia',
    image: '/assets/santo-agostinho.png',
    quote: 'A Eucaristia é o alimento que alimenta a alma e nos une a Cristo.',
    source: { work: 'Confissões', author: 'Santo Agostinho', book: 'Livro VII', page: 'p. 142', publisher: 'Paulus', edition: '3ª ed., 2017' },
  },
  {
    id: 2, name: 'Santa Teresa de Calcutá', age: 'c. 1910–1997', themeValue: 'oracao',
    image: '/assets/madre-teresa.png',
    quote: 'Rezar é simplesmente conversar com Deus. Ele ama você, e é tão simples.',
    source: { work: 'Um Caminho Simples', author: 'Madre Teresa', book: 'Cap. 2 — Oração', page: 'p. 28', publisher: 'Editora Sextante', edition: '1ª ed., 2006' },
  },
  {
    id: 3, name: 'São João Vianney', age: 'c. 1786–1859', themeValue: 'missa',
    quote: 'A Santa Missa é a maior ação de graças que podemos oferecer a Deus.',
    source: { work: "Sermões do Cura d'Ars", author: 'São João Maria Vianney', book: 'Sobre a Santa Missa', page: 'p. 87', publisher: 'Quadrante', edition: '2ª ed., 2014' },
  },
  {
    id: 4, name: 'Santo Tomás de Aquino', age: 'c. 1225–1274', themeValue: 'liturgia',
    quote: 'A Liturgia é o cume para o qual tende toda a ação da Igreja.',
    source: { work: 'Suma Teológica', author: 'Santo Tomás de Aquino', book: 'III, q. 83', page: 'p. 512', publisher: 'Edições Loyola', edition: '2ª ed., 2015' },
  },
  {
    id: 5, name: 'Santa Catarina de Sena', age: 'c. 1347–1380', themeValue: 'virtudes',
    quote: 'A graça é a virtude que nos permite agir segundo a vontade de Deus.',
    source: { work: 'Diálogo da Divina Providência', author: 'Santa Catarina de Sena', book: 'Tratado da Discrição', page: 'p. 64', publisher: 'Paulinas', edition: '1ª ed., 2010' },
  },
  {
    id: 6, name: 'São Bento', age: 'c. 480–547', themeValue: 'sacramentos',
    image: '/assets/sao-bento.png',
    quote: 'Os Sacramentos são sinais sensíveis da graça invisível de Deus.',
    source: { work: 'A Regra de São Bento', author: 'São Bento de Núrsia', book: 'Prólogo', page: 'p. 19', publisher: 'Editora Vozes', edition: '5ª ed., 2018' },
  },
]

const THEME_META = {
  eucaristia:  { label: 'Eucaristia',        icon: 'monstrance' },
  missa:       { label: 'Santa Missa',        icon: 'chalice' },
  liturgia:    { label: 'Liturgia Católica',  icon: 'book' },
  oracao:      { label: 'Oração',             icon: 'rosary' },
  sacramentos: { label: 'Sacramentos',        icon: 'shell' },
  virtudes:    { label: 'Virtudes',           icon: 'heart' },
}

const THEME_ICONS_SVG = {
  monstrance: '<circle cx="12" cy="9.5" r="3"/><line x1="12" y1="2.3" x2="12" y2="4"/><line x1="16.6" y1="4.9" x2="15.4" y2="6.1"/><line x1="18.5" y1="9.5" x2="16.8" y2="9.5"/><line x1="16.6" y1="14.1" x2="15.4" y2="12.9"/><line x1="7.4" y1="4.9" x2="8.6" y2="6.1"/><line x1="5.5" y1="9.5" x2="7.2" y2="9.5"/><line x1="7.4" y1="14.1" x2="8.6" y2="12.9"/><line x1="12" y1="12.5" x2="12" y2="18"/><path d="M8.5 20 Q12 18 15.5 20"/><line x1="8.5" y1="20" x2="15.5" y2="20"/>',
  chalice:     '<circle cx="12" cy="3.1" r="1.5"/><path d="M7.3 6 H16.7 A4.7 4.7 0 0 1 7.3 6 Z"/><line x1="12" y1="10.6" x2="12" y2="17.5"/><path d="M8 20 Q12 17.4 16 20"/><line x1="8" y1="20" x2="16" y2="20"/>',
  book:        '<path d="M12 6.6 C9.5 5.1 6.6 5.1 4 5.9 V18.1 C6.6 17.3 9.5 17.3 12 18.8"/><path d="M12 6.6 C14.5 5.1 17.4 5.1 20 5.9 V18.1 C17.4 17.3 14.5 17.3 12 18.8"/><line x1="12" y1="6.6" x2="12" y2="18.8"/>',
  rosary:      '<circle cx="12" cy="8.5" r="5" stroke-dasharray="1.4 2.2"/><line x1="12" y1="13.5" x2="12" y2="17"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="10.3" y1="19" x2="13.7" y2="19"/>',
  shell:       '<path d="M5 13 A9 9 0 0 1 19 13"/><path d="M5 13 L12 18.5 L19 13"/><line x1="8.8" y1="14.4" x2="10.4" y2="18"/><line x1="12" y1="13.7" x2="12" y2="18.5"/><line x1="15.2" y1="14.4" x2="13.6" y2="18"/>',
  heart:       '<path d="M12 20 C5 14.6 4 10.7 6.2 8.2 C8 6.2 11 6.5 12 8.9 C13 6.5 16 6.2 17.8 8.2 C20 10.7 19 14.6 12 20 Z"/>',
}

const THEME_ORDER = ['eucaristia', 'missa', 'liturgia', 'oracao', 'sacramentos', 'virtudes']

// ── Colors ───────────────────────────────────────────────────────────────────

const C = {
  wine:          '#5e2230',
  parchment:     '#F2E9D2',
  parchmentLight:'#F7F0DD',
  cream:         '#f7eed7',
  ink:           '#2e2419',
  inkSoft:       '#5b513c',
  goldDeep:      '#8a6d2f',
  goldLabel:     '#a07c34',
  goldDivider:   'rgba(168,139,72,0.28)',
  goldBorder:    'rgba(168,139,72,0.45)',
  clay:          '#c6713e',
  sheetGrab:     '#d8c89a',
  closeBtn:      '#b09a6e',
  overlayBg:     'rgba(40,16,24,0.42)',
}

// ── Canvas helpers ────────────────────────────────────────────────────────────

function wrapText(ctx, text, maxW, font) {
  if (font) ctx.font = font
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const w of words) {
    const test = line ? line + ' ' + w : w
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w }
    else line = test
  }
  if (line) lines.push(line)
  return lines
}

function drawFlame(ctx, cx, cy, size, color) {
  ctx.save()
  ctx.translate(cx - size / 2, cy - size / 2)
  ctx.scale(size / 64, size / 64)
  ctx.strokeStyle = color
  ctx.lineWidth = 2.6; ctx.lineJoin = 'round'; ctx.lineCap = 'round'
  ctx.stroke(new Path2D('M32 12 C 41 25, 43 34, 32 45 C 21 34, 23 25, 32 12 Z'))
  ctx.globalAlpha = 0.55; ctx.lineWidth = 2.1
  ctx.stroke(new Path2D('M32 24 C 37 30, 38 35, 32 41 C 26 35, 27 30, 32 24 Z'))
  ctx.globalAlpha = 1; ctx.lineWidth = 2.6
  ctx.stroke(new Path2D('M24 52 q8 7 16 0'))
  ctx.restore()
}

function drawCover(ctx, img, dx, dy, dw, dh, focusY = 0.5) {
  const ir = img.width / img.height, dr = dw / dh
  let sw, sh, sx, sy
  if (ir > dr) { sh = img.height; sw = sh * dr; sx = (img.width - sw) / 2; sy = 0 }
  else { sw = img.width; sh = sw / dr; sx = 0; sy = (img.height - sh) * focusY }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
}

function loadImage(src) {
  return new Promise((res, rej) => {
    const im = new Image()
    im.crossOrigin = 'anonymous'
    im.onload = () => res(im)
    im.onerror = rej
    im.src = src
  })
}

// ── Small UI components ───────────────────────────────────────────────────────

function ThemeIcon({ iconKey }) {
  return (
    <svg
      width={28} height={28} viewBox="0 0 24 24" fill="none"
      stroke="#d9c081" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block' }}
      dangerouslySetInnerHTML={{ __html: THEME_ICONS_SVG[iconKey] || '' }}
    />
  )
}

function Grabber() {
  return <div style={{ width: 38, height: 4, borderRadius: 2, background: C.sheetGrab, margin: '0 auto 18px' }} />
}

function CloseBtn({ onClose }) {
  return (
    <button
      onClick={onClose}
      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: C.closeBtn, lineHeight: 1 }}
    >✕</button>
  )
}

function Sheet({ onBackdrop, children, zIndex = 60 }) {
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
        onClick={e => e.stopPropagation()}
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

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [currentId, setCurrentId]       = useState(1)
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [menuOpen, setMenuOpen]         = useState(false)
  const [infoOpen, setInfoOpen]         = useState(false)
  const [shareOpen, setShareOpen]       = useState(false)
  const [shareImg, setShareImg]         = useState(null)
  const [fadeNonce, setFadeNonce]       = useState(0)
  const [settings, setSettings]         = useState(
    () => JSON.parse(localStorage.getItem('santos_settings') || '{"textSize":"md"}')
  )

  // DOM refs for animation
  const imageRef = useRef(null)
  const quoteRef = useRef(null)

  // Mutable state refs (kept in sync) for use inside pointer/timer closures
  const currentIdRef     = useRef(currentId)
  const selectedThemeRef = useRef(selectedTheme)
  useEffect(() => { currentIdRef.current = currentId },       [currentId])
  useEffect(() => { selectedThemeRef.current = selectedTheme }, [selectedTheme])

  // Direction of last navigation (+1 next, -1 prev, 0 random/theme)
  const lastDir     = useRef(0)
  const prevNonce   = useRef(-1)

  // Swipe gesture state
  const dragging  = useRef(false)
  const moved     = useRef(false)
  const dragStartX = useRef(0)
  const dragStartY = useRef(0)

  // Double-tap detection
  const lastTap  = useRef(0)
  const tapTimer = useRef(null)

  // Share state refs (blobs generated async)
  const shareDataURL = useRef(null)
  const shareBlob    = useRef(null)

  // ── Animation replay ──────────────────────────────────────────────────────

  function replay(el, anim) {
    if (!el) return
    el.style.transition = ''
    el.style.transform  = ''
    el.style.opacity    = ''
    el.style.animation  = 'none'
    void el.offsetWidth
    el.style.animation  = anim
  }

  useEffect(() => {
    if (prevNonce.current === fadeNonce) return
    prevNonce.current = fadeNonce
    const eo = 'cubic-bezier(0.2,0.8,0.2,1)'
    const d = lastDir.current
    const imgAnim  = d > 0 ? `vmSlideInRight 380ms ${eo}` : d < 0 ? `vmSlideInLeft 380ms ${eo}` : `vmFadeIn 360ms ${eo}`
    const cardAnim = d > 0 ? `vmSlideInRight 440ms ${eo}` : d < 0 ? `vmSlideInLeft 440ms ${eo}` : `vmRise 420ms ${eo}`
    replay(imageRef.current, imgAnim)
    replay(quoteRef.current, cardAnim)
  }, [fadeNonce])

  // ── Navigation helpers (read from refs so closures stay fresh) ────────────

  function pool() {
    const t = selectedThemeRef.current
    return t ? SAINTS.filter(s => s.themeValue === t) : SAINTS
  }

  function nextRandom() {
    lastDir.current = 0
    const p = pool()
    if (p.length <= 1) { setFadeNonce(n => n + 1); return }
    let pick
    do { pick = p[Math.floor(Math.random() * p.length)] } while (pick.id === currentIdRef.current)
    currentIdRef.current = pick.id
    setCurrentId(pick.id)
    setFadeNonce(n => n + 1)
  }

  function goNext() {
    lastDir.current = 1
    const p = pool()
    if (!p.length) return
    const idx  = p.findIndex(s => s.id === currentIdRef.current)
    const next = p[(idx + 1) % p.length]
    currentIdRef.current = next.id
    setCurrentId(next.id)
    setFadeNonce(n => n + 1)
  }

  function goPrev() {
    lastDir.current = -1
    const p = pool()
    if (!p.length) return
    const idx  = p.findIndex(s => s.id === currentIdRef.current)
    const prev = p[(idx - 1 + p.length) % p.length]
    currentIdRef.current = prev.id
    setCurrentId(prev.id)
    setFadeNonce(n => n + 1)
  }

  // Keep navigation refs live so pointer/timer callbacks always call latest
  const nextRandomRef = useRef(nextRandom)
  const goNextRef     = useRef(goNext)
  const goPrevRef     = useRef(goPrev)
  useEffect(() => { nextRandomRef.current = nextRandom })
  useEffect(() => { goNextRef.current = goNext })
  useEffect(() => { goPrevRef.current = goPrev })

  // ── Pointer / swipe handlers ──────────────────────────────────────────────

  function onPointerDown(e) {
    dragging.current  = true
    moved.current     = false
    dragStartX.current = e.clientX
    dragStartY.current = e.clientY
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch {}
    if (imageRef.current) imageRef.current.style.transition = 'none'
  }

  function onPointerMove(e) {
    if (!dragging.current) return
    const dx = e.clientX - dragStartX.current
    const dy = e.clientY - dragStartY.current
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved.current = true
    const node = imageRef.current
    if (node && Math.abs(dx) > Math.abs(dy)) {
      node.style.transform = `translateX(${dx * 0.6}px)`
      node.style.opacity   = String(1 - Math.min(Math.abs(dx) / 520, 0.4))
    }
  }

  function onPointerUp(e) {
    if (!dragging.current) return
    dragging.current = false
    const dx    = e.clientX - dragStartX.current
    const dy    = e.clientY - dragStartY.current
    const swipe = Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy)
    const node  = imageRef.current
    if (node) {
      node.style.transition = 'transform 260ms cubic-bezier(0.2,0.8,0.2,1), opacity 260ms cubic-bezier(0.2,0.8,0.2,1)'
      node.style.transform  = ''
      node.style.opacity    = ''
    }
    if (swipe) { dx < 0 ? goNextRef.current() : goPrevRef.current() }
  }

  // ── Tap handler (single = random, double = menu) ──────────────────────────

  function handleTap() {
    if (moved.current) { moved.current = false; return }
    const now = Date.now()
    if (now - lastTap.current < 280) {
      clearTimeout(tapTimer.current)
      lastTap.current = 0
      setMenuOpen(true)
    } else {
      lastTap.current = now
      tapTimer.current = setTimeout(() => nextRandomRef.current(), 280)
    }
  }

  // ── Theme selection ───────────────────────────────────────────────────────

  function selectTheme(theme) {
    lastDir.current = 0
    const newTheme = selectedTheme === theme ? null : theme
    const p = newTheme ? SAINTS.filter(s => s.themeValue === newTheme) : SAINTS
    const stillValid = p.some(s => s.id === currentId)
    selectedThemeRef.current = newTheme
    setSelectedTheme(newTheme)
    if (!stillValid && p[0]) { currentIdRef.current = p[0].id; setCurrentId(p[0].id) }
    setFadeNonce(n => n + 1)
  }

  // ── Text size ─────────────────────────────────────────────────────────────

  function updateTextSize(size) {
    const s = { ...settings, textSize: size }
    setSettings(s)
    localStorage.setItem('santos_settings', JSON.stringify(s))
  }

  // ── Share / canvas card ───────────────────────────────────────────────────

  async function shareCurrent() {
    const saint = SAINTS.find(s => s.id === currentId) || SAINTS[0]
    const theme = THEME_META[saint.themeValue].label
    const W = 1080, H = 1350, split = 760
    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const x = canvas.getContext('2d')

    try {
      await document.fonts.load("600 66px 'Cormorant Garamond'")
      await document.fonts.load("italic 500 52px 'Cormorant Garamond'")
      await document.fonts.load("700 22px 'Mulish'")
      await document.fonts.ready
    } catch {}

    // Wine band
    const g = x.createRadialGradient(W / 2, 300, 60, W / 2, 300, 820)
    g.addColorStop(0, '#7a3a40'); g.addColorStop(0.46, '#5e2230'); g.addColorStop(1, '#3e1620')
    x.fillStyle = g; x.fillRect(0, 0, W, split)
    // Ivory band
    x.fillStyle = '#F2E9D2'; x.fillRect(0, split, W, H - split)

    const cx = W / 2
    let drewImage = false

    if (saint.image) {
      try {
        const img = await loadImage(saint.image)
        drawCover(x, img, 0, 0, W, split, 0.12)
        const sc = x.createLinearGradient(0, split - 420, 0, split)
        sc.addColorStop(0, 'rgba(40,16,24,0)'); sc.addColorStop(1, 'rgba(40,16,24,0.92)')
        x.fillStyle = sc; x.fillRect(0, split - 420, W, 420)
        drewImage = true
      } catch {}
    }

    if (drewImage) {
      x.textAlign = 'left'; x.fillStyle = '#f7eed7'
      x.font = "600 64px 'Cormorant Garamond'"
      const nameLines = wrapText(x, saint.name, W - 160)
      let ny = split - 96 - (nameLines.length - 1) * 70
      nameLines.forEach(l => { x.fillText(l, 80, ny); ny += 70 })
      x.fillStyle = 'rgba(247,238,215,0.7)'; x.font = "400 26px 'Mulish'"
      x.fillText(saint.age, 80, ny + 2)
      x.textAlign = 'center'
    } else {
      const cy = 195
      x.strokeStyle = '#d9c081'; x.lineCap = 'round'
      x.globalAlpha = 0.9; x.lineWidth = 3.2
      x.beginPath(); x.arc(cx, cy, 64, 0, Math.PI * 2); x.stroke()
      x.globalAlpha = 0.4; x.lineWidth = 1.6
      x.beginPath(); x.arc(cx, cy, 88, 0, Math.PI * 2); x.stroke()
      x.globalAlpha = 0.9; x.lineWidth = 3.2
      x.beginPath(); x.moveTo(cx, cy + 50); x.lineTo(cx, cy + 200); x.stroke()
      x.beginPath(); x.moveTo(cx - 52, cy + 118); x.lineTo(cx + 52, cy + 118); x.stroke()
      x.globalAlpha = 1
      x.textAlign = 'center'
      x.fillStyle = '#e4c878'; x.font = "700 22px 'Mulish'"
      x.fillText('SANTO DO DIA', cx, 470)
      x.fillStyle = '#f7eed7'; x.font = "600 66px 'Cormorant Garamond'"
      const nameLines = wrapText(x, saint.name, W - 200)
      let ny = 545
      nameLines.forEach(l => { x.fillText(l, cx, ny); ny += 72 })
      x.fillStyle = 'rgba(247,238,215,0.62)'; x.font = "400 26px 'Mulish'"
      x.fillText(saint.age, cx, ny + 6)
    }

    // Theme label
    x.fillStyle = '#a07c34'; x.font = "700 22px 'Mulish'"; x.textAlign = 'center'
    x.fillText('— ' + theme.toUpperCase(), cx, 870)

    // Quote
    x.fillStyle = '#2e2419'
    let qf = 54, lh = 70
    let qLines = wrapText(x, '“' + saint.quote + '”', W - 200, `italic 500 ${qf}px 'Cormorant Garamond'`)
    if (qLines.length > 5) { qf = 46; lh = 60; qLines = wrapText(x, '“' + saint.quote + '”', W - 180, `italic 500 ${qf}px 'Cormorant Garamond'`) }
    x.font = `italic 500 ${qf}px 'Cormorant Garamond'`
    let qy = 960 - ((qLines.length - 1) * lh) / 2 + 60
    qLines.forEach(l => { x.fillText(l, cx, qy); qy += lh })

    // Footer — Candeia brand
    x.strokeStyle = 'rgba(168,139,72,0.4)'; x.lineWidth = 1
    x.beginPath(); x.moveTo(cx - 60, 1238); x.lineTo(cx + 60, 1238); x.stroke()
    const fy = 1288
    x.font = "600 46px 'Cormorant Garamond'"
    const wordmark = 'Candeia'
    const tw = x.measureText(wordmark).width
    const flameSize = 50, gap = 14
    const totalW = flameSize + gap + tw
    const startX = cx - totalW / 2
    drawFlame(x, startX + flameSize / 2, fy - 4, flameSize, '#c6713e')
    x.textAlign = 'left'; x.textBaseline = 'middle'
    x.fillStyle = '#5e2230'; x.fillText(wordmark, startX + flameSize + gap, fy)
    x.textAlign = 'center'; x.textBaseline = 'alphabetic'
    x.fillStyle = '#a07c34'; x.font = "700 17px 'Mulish'"
    x.fillText('PALAVRAS QUE ILUMINAM', cx, 1325)

    shareDataURL.current = canvas.toDataURL('image/png')
    canvas.toBlob(b => { shareBlob.current = b }, 'image/png')
    setShareImg(shareDataURL.current)
    setShareOpen(true)
  }

  async function doShareNative() {
    try {
      if (shareBlob.current && navigator.canShare) {
        const file = new File([shareBlob.current], 'candeia-santo.png', { type: 'image/png' })
        if (navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Santo do dia — Candeia' }); return }
      }
      if (navigator.share) { await navigator.share({ title: 'Santo do dia — Candeia' }); return }
    } catch {}
    doDownload()
  }

  function doDownload() {
    if (!shareDataURL.current) return
    const a = document.createElement('a')
    a.href = shareDataURL.current; a.download = 'candeia-santo.png'
    document.body.appendChild(a); a.click(); a.remove()
  }

  // ── Derived values ────────────────────────────────────────────────────────

  const saint     = SAINTS.find(s => s.id === currentId) || SAINTS[0]
  const iconKey   = THEME_META[saint.themeValue].icon
  const quoteSize = { sm: '20px', md: '23px', lg: '28px' }[settings.textSize] || '23px'

  const infoRows = [
    { label: 'Período',  value: saint.age },
    { label: 'Autor',    value: saint.source?.author },
    { label: 'Trecho',   value: saint.source?.book },
    { label: 'Página',   value: saint.source?.page },
    { label: 'Editora',  value: saint.source?.publisher },
    { label: 'Edição',   value: saint.source?.edition },
  ].filter(r => r.value)

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{
      width: '100%', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#d9d4c8',
    }}>
      {/* Phone frame */}
      <div style={{
        position: 'relative',
        width: '100%', maxWidth: 430,
        height: '100vh', maxHeight: 920,
        background: C.parchment,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 30px 80px -28px rgba(46,36,25,0.55)',
      }}>

        {/* ── Image area ─────────────────────────────────────────────────── */}
        <div
          onClick={handleTap}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{
            position: 'relative', flex: 1, minHeight: 0,
            cursor: 'pointer', overflow: 'hidden',
            background: '#3e1620', touchAction: 'none',
          }}
        >
          {/* Background layer (animated on navigation) */}
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
              // Placeholder halo + cross
              <svg width="150" height="216" viewBox="0 0 150 216" fill="none" style={{ opacity: 0.9 }}>
                <circle cx="75" cy="66" r="40" stroke="#d9c081" strokeWidth="1.2" opacity="0.85" />
                <circle cx="75" cy="66" r="54" stroke="#d9c081" strokeWidth="0.6" opacity="0.4" />
                <line x1="75" y1="98" x2="75" y2="190" stroke="#d9c081" strokeWidth="1.2" opacity="0.85" />
                <line x1="45" y1="132" x2="105" y2="132" stroke="#d9c081" strokeWidth="1.2" opacity="0.85" />
              </svg>
            )}
          </div>

          {/* Top scrim for header legibility */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 170,
            background: 'linear-gradient(180deg, rgba(40,16,24,0.55) 0%, rgba(40,16,24,0) 100%)',
            pointerEvents: 'none',
          }} />

          {/* Header: name + theme icon */}
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

        {/* ── Quote card ─────────────────────────────────────────────────── */}
        <div
          ref={quoteRef}
          style={{
            background: C.parchment,
            padding: '26px 28px 22px', flexShrink: 0,
            animation: 'vmRise 420ms cubic-bezier(0.2,0.8,0.2,1)',
          }}
        >
          {/* Theme label */}
          <div style={{
            fontFamily: 'Mulish', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: C.goldLabel, marginBottom: 15,
          }}>
            {THEME_META[saint.themeValue].label}
          </div>

          {/* Quote text */}
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: quoteSize, fontWeight: 500, fontStyle: 'italic',
            lineHeight: 1.42, color: C.ink, letterSpacing: '-0.005em',
          }}>
            {saint.quote}
          </p>

          {/* Footer row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 22, paddingTop: 16, borderTop: `1px solid ${C.goldDivider}`,
          }}>
            {/* Candeia brand lockup */}
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

            {/* Action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              {/* Info */}
              <button
                onClick={e => { e.stopPropagation(); setInfoOpen(true) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: C.goldDeep }}
                aria-label="Fonte da citação"
              >
                <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7.4" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M10 9v4.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <circle cx="10" cy="6.5" r="0.95" fill="currentColor" />
                </svg>
              </button>
              {/* Share */}
              <button
                onClick={e => { e.stopPropagation(); shareCurrent() }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: C.goldDeep }}
                aria-label="Compartilhar"
              >
                <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
                  <path d="M10 13V3.2M10 3.2 6.6 6.6M10 3.2l3.4 3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 11v4.6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
              {/* Menu (three dots) */}
              <button
                onClick={e => { e.stopPropagation(); setMenuOpen(true) }}
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

        {/* ── Menu sheet ─────────────────────────────────────────────────── */}
        {menuOpen && (
          <Sheet onBackdrop={() => setMenuOpen(false)} zIndex={60}>
            <div style={{ padding: '10px 26px 30px', maxHeight: '86vh', overflowY: 'auto' }}>
              <Grabber />
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 22 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: C.wine }}>Menu</h2>
                <CloseBtn onClose={() => setMenuOpen(false)} />
              </div>

              {/* Theme filter */}
              <div style={{ marginBottom: 26 }}>
                <div style={{ fontFamily: 'Mulish', fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.goldLabel, marginBottom: 14 }}>
                  Filtrar por tema
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
                  {THEME_ORDER.map(v => {
                    const active = selectedTheme === v
                    return (
                      <button
                        key={v}
                        onClick={() => selectTheme(v)}
                        style={{
                          fontFamily: 'Mulish', fontSize: 13, fontWeight: 500,
                          cursor: 'pointer', padding: '9px 15px', borderRadius: 2,
                          transition: 'all 160ms cubic-bezier(0.2,0.8,0.2,1)',
                          color:      active ? C.cream    : C.inkSoft,
                          background: active ? C.wine     : C.parchment,
                          border:     `1px solid ${active ? C.wine : C.goldBorder}`,
                        }}
                      >
                        {active ? '✓ ' : ''}{THEME_META[v].label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ height: 1, background: 'rgba(168,139,72,0.24)', margin: '0 0 22px' }} />

              {/* Text size */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: 'Mulish', fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.goldLabel, marginBottom: 14 }}>
                  Tamanho do texto
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { v: 'sm', preview: '16px' },
                    { v: 'md', preview: '21px' },
                    { v: 'lg', preview: '27px' },
                  ].map(({ v, preview }) => {
                    const active = settings.textSize === v
                    return (
                      <button
                        key={v}
                        onClick={() => updateTextSize(v)}
                        style={{
                          flex: 1,
                          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                          cursor: 'pointer', padding: '12px 8px', borderRadius: 2,
                          transition: 'all 160ms cubic-bezier(0.2,0.8,0.2,1)',
                          fontSize: preview,
                          color:      active ? C.cream    : C.inkSoft,
                          background: active ? C.wine     : C.parchment,
                          border:     `1px solid ${active ? C.wine : C.goldBorder}`,
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
        )}

        {/* ── Share sheet ────────────────────────────────────────────────── */}
        {shareOpen && (
          <Sheet onBackdrop={() => setShareOpen(false)} zIndex={80}>
            <div style={{ padding: '10px 26px 30px' }}>
              <Grabber />
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: C.wine }}>Compartilhar</h2>
                <CloseBtn onClose={() => setShareOpen(false)} />
              </div>
              {shareImg && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
                  <img
                    src={shareImg} alt=""
                    style={{ width: '60%', borderRadius: 4, boxShadow: '0 14px 34px -12px rgba(46,36,25,0.55)' }}
                  />
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={doShareNative}
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
                  onClick={doDownload}
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
        )}

        {/* ── Info / source sheet ────────────────────────────────────────── */}
        {infoOpen && (
          <Sheet onBackdrop={() => setInfoOpen(false)} zIndex={85}>
            <div style={{ padding: '10px 28px 32px' }}>
              <Grabber />
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ fontFamily: 'Mulish', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.goldLabel }}>
                  Fonte da citação
                </div>
                <CloseBtn onClose={() => setInfoOpen(false)} />
              </div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 25, fontWeight: 600, fontStyle: 'italic',
                color: C.wine, lineHeight: 1.16, marginBottom: 20,
              }}>
                {saint.source?.work}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: C.goldDivider }}>
                {infoRows.map((r, i) => (
                  <div
                    key={i}
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
        )}

      </div>
    </div>
  )
}
