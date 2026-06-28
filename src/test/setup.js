import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// localStorage em memória (determinístico e independente da versão do jsdom).
class MemoryStorage {
  #store = new Map()
  get length() { return this.#store.size }
  key(i) { return [...this.#store.keys()][i] ?? null }
  getItem(k) { return this.#store.has(String(k)) ? this.#store.get(String(k)) : null }
  setItem(k, v) { this.#store.set(String(k), String(v)) }
  removeItem(k) { this.#store.delete(String(k)) }
  clear() { this.#store.clear() }
}

Object.defineProperty(globalThis, 'localStorage', {
  value: new MemoryStorage(),
  configurable: true,
  writable: true,
})

// Desmonta componentes/hooks e limpa storage entre os testes.
afterEach(() => {
  cleanup()
  localStorage.clear()
})
