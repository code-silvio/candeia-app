import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Config dedicada de teste (sem o plugin PWA, que só importa no build).
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
    include: ['src/**/*.{test,spec}.{js,jsx}', 'scripts/**/*.{test,spec}.js'],
  },
})
