import { useCallback, useEffect, useRef, useState } from 'react'
import { EASE } from '../theme/tokens'

// Reinicia uma animação CSS no elemento (force reflow + nova animation).
function replay(el, anim) {
  if (!el) return
  el.style.transition = ''
  el.style.transform = ''
  el.style.opacity = ''
  el.style.animation = 'none'
  void el.offsetWidth
  el.style.animation = anim
}

/**
 * Encapsula navegação entre santos (aleatório, próximo, anterior), filtro por
 * tema, gestos de toque/arraste e as animações de transição.
 *
 * @param {object[]} saints  Lista de santos (data layer).
 * @param {() => void} onDoubleTap  Callback do duplo-toque (abre o menu).
 */
export function useSaintCarousel(saints, onDoubleTap) {
  const [currentId, setCurrentId] = useState(() => saints[0]?.id ?? null)
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [fadeNonce, setFadeNonce] = useState(0)

  // Refs de DOM para reproduzir as animações.
  const imageRef = useRef(null)
  const quoteRef = useRef(null)

  // Espelhos em ref para leitura dentro de closures de gesto/timer.
  const currentIdRef = useRef(currentId)
  const selectedThemeRef = useRef(selectedTheme)
  useEffect(() => { currentIdRef.current = currentId }, [currentId])
  useEffect(() => { selectedThemeRef.current = selectedTheme }, [selectedTheme])

  // Direção da última navegação: +1 próximo, -1 anterior, 0 aleatório/tema.
  const lastDir = useRef(0)
  const prevNonce = useRef(-1)

  // Estado do gesto de arraste (swipe).
  const dragging = useRef(false)
  const moved = useRef(false)
  const dragStartX = useRef(0)
  const dragStartY = useRef(0)

  // Detecção de duplo-toque.
  const lastTap = useRef(0)
  const tapTimer = useRef(null)

  // onDoubleTap pode ser recriado a cada render; mantemos a referência viva.
  const doubleTapRef = useRef(onDoubleTap)
  useEffect(() => { doubleTapRef.current = onDoubleTap })

  // Limpa timer de toque ao desmontar.
  useEffect(() => () => clearTimeout(tapTimer.current), [])

  // Dispara as animações quando o santo muda (fadeNonce).
  useEffect(() => {
    if (prevNonce.current === fadeNonce) return
    prevNonce.current = fadeNonce
    const d = lastDir.current
    const imgAnim = d > 0 ? `vmSlideInRight 380ms ${EASE}` : d < 0 ? `vmSlideInLeft 380ms ${EASE}` : `vmFadeIn 360ms ${EASE}`
    const cardAnim = d > 0 ? `vmSlideInRight 440ms ${EASE}` : d < 0 ? `vmSlideInLeft 440ms ${EASE}` : `vmRise 420ms ${EASE}`
    replay(imageRef.current, imgAnim)
    replay(quoteRef.current, cardAnim)
  }, [fadeNonce])

  const pool = useCallback(() => {
    const t = selectedThemeRef.current
    return t ? saints.filter((s) => s.themeValue === t) : saints
  }, [saints])

  const bump = useCallback(() => setFadeNonce((n) => n + 1), [])

  const nextRandom = useCallback(() => {
    lastDir.current = 0
    const p = pool()
    if (p.length <= 1) { bump(); return }
    let pick
    do { pick = p[Math.floor(Math.random() * p.length)] } while (pick.id === currentIdRef.current)
    currentIdRef.current = pick.id
    setCurrentId(pick.id)
    bump()
  }, [pool, bump])

  const goNext = useCallback(() => {
    lastDir.current = 1
    const p = pool()
    if (!p.length) return
    const idx = p.findIndex((s) => s.id === currentIdRef.current)
    const next = p[(idx + 1) % p.length]
    currentIdRef.current = next.id
    setCurrentId(next.id)
    bump()
  }, [pool, bump])

  const goPrev = useCallback(() => {
    lastDir.current = -1
    const p = pool()
    if (!p.length) return
    const idx = p.findIndex((s) => s.id === currentIdRef.current)
    const prev = p[(idx - 1 + p.length) % p.length]
    currentIdRef.current = prev.id
    setCurrentId(prev.id)
    bump()
  }, [pool, bump])

  const selectTheme = useCallback((theme) => {
    lastDir.current = 0
    const newTheme = selectedThemeRef.current === theme ? null : theme
    const p = newTheme ? saints.filter((s) => s.themeValue === newTheme) : saints
    const stillValid = p.some((s) => s.id === currentIdRef.current)
    selectedThemeRef.current = newTheme
    setSelectedTheme(newTheme)
    if (!stillValid && p[0]) { currentIdRef.current = p[0].id; setCurrentId(p[0].id) }
    bump()
  }, [saints, bump])

  // ── Gestos ──────────────────────────────────────────────────────────────────

  const onPointerDown = useCallback((e) => {
    dragging.current = true
    moved.current = false
    dragStartX.current = e.clientX
    dragStartY.current = e.clientY
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* sem suporte a pointer capture */ }
    if (imageRef.current) imageRef.current.style.transition = 'none'
  }, [])

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return
    const dx = e.clientX - dragStartX.current
    const dy = e.clientY - dragStartY.current
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved.current = true
    const node = imageRef.current
    if (node && Math.abs(dx) > Math.abs(dy)) {
      node.style.transform = `translateX(${dx * 0.6}px)`
      node.style.opacity = String(1 - Math.min(Math.abs(dx) / 520, 0.4))
    }
  }, [])

  const onPointerUp = useCallback((e) => {
    if (!dragging.current) return
    dragging.current = false
    const dx = e.clientX - dragStartX.current
    const dy = e.clientY - dragStartY.current
    const swipe = Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy)
    const node = imageRef.current
    if (node) {
      node.style.transition = `transform 260ms ${EASE}, opacity 260ms ${EASE}`
      node.style.transform = ''
      node.style.opacity = ''
    }
    if (swipe) { dx < 0 ? goNext() : goPrev() }
  }, [goNext, goPrev])

  const onClick = useCallback(() => {
    if (moved.current) { moved.current = false; return }
    const now = Date.now()
    if (now - lastTap.current < 280) {
      clearTimeout(tapTimer.current)
      lastTap.current = 0
      doubleTapRef.current?.()
    } else {
      lastTap.current = now
      tapTimer.current = setTimeout(() => nextRandom(), 280)
    }
  }, [nextRandom])

  const saint = saints.find((s) => s.id === currentId) || saints[0]

  return {
    saint,
    selectedTheme,
    selectTheme,
    imageRef,
    quoteRef,
    stageHandlers: { onClick, onPointerDown, onPointerMove, onPointerUp },
  }
}
