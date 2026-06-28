import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script', // registerSW.js externo → mantém CSP sem inline script
      includeAssets: ['candeia-icon.svg', 'assets/*.png'],
      manifest: {
        name: 'Candeia — Palavras que iluminam',
        short_name: 'Candeia',
        description: 'Citações de santos para iluminar o dia.',
        lang: 'pt-BR',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#F2E9D2',
        theme_color: '#5e2230',
        icons: [
          { src: '/candeia-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: '/candeia-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        // App shell offline (SPA).
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            // Conteúdo (REST do Supabase): mostra cache na hora, revalida em background.
            urlPattern: ({ url }) => url.hostname.endsWith('.supabase.co') && url.pathname.startsWith('/rest/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'supabase-rest',
              expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
          {
            // Imagens dos santos (Storage do Supabase): cache-first.
            urlPattern: ({ url }) => url.hostname.endsWith('.supabase.co') && url.pathname.includes('/storage/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-images',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // Google Fonts (CSS + arquivos de fonte).
            urlPattern: ({ url }) => url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com'),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts' },
          },
        ],
      },
    }),
  ],
})
