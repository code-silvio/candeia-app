import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useSaintCarousel } from './useSaintCarousel'

// Fixture com 2 santos no mesmo tema (p/ testar pool) + 1 em outro.
const SAINTS = [
  { id: 1, name: 'A', themeValue: 'oracao', quote: 'q1', source: {} },
  { id: 2, name: 'B', themeValue: 'oracao', quote: 'q2', source: {} },
  { id: 3, name: 'C', themeValue: 'missa', quote: 'q3', source: {} },
]

const fakeEvt = (x, y = 100) => ({ clientX: x, clientY: y, pointerId: 1, currentTarget: { setPointerCapture() {} } })

function swipe(handlers, fromX, toX) {
  act(() => {
    handlers.onPointerDown(fakeEvt(fromX))
    handlers.onPointerMove(fakeEvt(toX))
    handlers.onPointerUp(fakeEvt(toX))
  })
}

afterEach(() => vi.restoreAllMocks())

describe('useSaintCarousel', () => {
  it('começa no primeiro santo', () => {
    const { result } = renderHook(() => useSaintCarousel(SAINTS, () => {}))
    expect(result.current.saint.id).toBe(1)
  })

  it('swipe para a esquerda avança (com wraparound)', () => {
    const { result } = renderHook(() => useSaintCarousel(SAINTS, () => {}))
    swipe(result.current.stageHandlers, 200, 110) // dx = -90 → próximo
    expect(result.current.saint.id).toBe(2)
    swipe(result.current.stageHandlers, 200, 110)
    expect(result.current.saint.id).toBe(3)
    swipe(result.current.stageHandlers, 200, 110)
    expect(result.current.saint.id).toBe(1) // wrap
  })

  it('swipe para a direita volta (com wraparound)', () => {
    const { result } = renderHook(() => useSaintCarousel(SAINTS, () => {}))
    swipe(result.current.stageHandlers, 100, 210) // dx = +110 → anterior (wrap p/ último)
    expect(result.current.saint.id).toBe(3)
  })

  it('movimento pequeno não conta como swipe', () => {
    const { result } = renderHook(() => useSaintCarousel(SAINTS, () => {}))
    swipe(result.current.stageHandlers, 200, 180) // dx = -20 (< 64)
    expect(result.current.saint.id).toBe(1)
  })

  it('duplo-toque dispara onDoubleTap e não troca o santo', () => {
    const onDoubleTap = vi.fn()
    const { result } = renderHook(() => useSaintCarousel(SAINTS, onDoubleTap))
    act(() => {
      result.current.stageHandlers.onClick()
      result.current.stageHandlers.onClick()
    })
    expect(onDoubleTap).toHaveBeenCalledTimes(1)
    expect(result.current.saint.id).toBe(1)
  })

  it('toque simples carrega um santo aleatório após o debounce', () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // floor(0.5*3) = índice 1 → id 2
    const { result } = renderHook(() => useSaintCarousel(SAINTS, () => {}))
    act(() => { result.current.stageHandlers.onClick() })
    act(() => { vi.advanceTimersByTime(300) })
    expect(result.current.saint.id).toBe(2)
    vi.useRealTimers()
  })

  it('filtra por tema e navega só dentro do filtro', () => {
    const { result } = renderHook(() => useSaintCarousel(SAINTS, () => {}))
    act(() => result.current.selectTheme('oracao')) // pool = [1, 2]
    expect(result.current.selectedTheme).toBe('oracao')
    swipe(result.current.stageHandlers, 200, 110)
    expect(result.current.saint.id).toBe(2)
    swipe(result.current.stageHandlers, 200, 110)
    expect(result.current.saint.id).toBe(1) // wrap dentro do tema
  })

  it('ao filtrar um tema sem o santo atual, salta para o primeiro do tema', () => {
    const { result } = renderHook(() => useSaintCarousel(SAINTS, () => {}))
    expect(result.current.saint.id).toBe(1) // tema oracao
    act(() => result.current.selectTheme('missa')) // 1 não está em missa → reconcilia p/ id 3
    expect(result.current.saint.id).toBe(3)
  })

  it('alternar o mesmo tema limpa o filtro', () => {
    const { result } = renderHook(() => useSaintCarousel(SAINTS, () => {}))
    act(() => result.current.selectTheme('oracao'))
    act(() => result.current.selectTheme('oracao'))
    expect(result.current.selectedTheme).toBe(null)
  })
})
