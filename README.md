# Candeia — Palavras que iluminam

App devocional católico: a cada toque, uma citação de santo em tela cheia, com a
fonte da obra original. Mobile-first, **PWA com offline total**, **sem login**,
somente leitura. Conteúdo curado e inserido por script.

> Origem: protótipo desenhado no Claude Design e implementado em React.
> O bundle de design original está em [`project/`](project/) (referência visual).

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + Vite 7 (PWA via `vite-plugin-pwa`) |
| Conteúdo | Supabase Postgres (tabela `saints`, RLS read-only) |
| Imagens | Supabase Storage (bucket público) |
| Deploy | Vercel (estático + headers de segurança) |
| Testes | Vitest + React Testing Library |

Sem backend próprio em runtime: o frontend lê o Supabase direto com a chave
`anon` (pública). A escrita acontece só via script local (`npm run seed`) com a
`service_role`. **A segurança vem da RLS**, não de esconder a chave anon.

## Como rodar (dev)

```bash
npm install
npm run dev      # http://localhost:5173
```

Sem `.env` configurado, o app cai no **seed local** ([`seeds/saints.json`](seeds/saints.json)) —
continua funcionando para desenvolvimento e offline.

Para conectar ao Supabase de verdade (schema, chaves, `.env`, seed, imagens e
deploy), siga o **[SETUP.md](SETUP.md)**.

## Scripts

| Comando | O quê |
|---|---|
| `npm run dev` | Dev server (Vite) |
| `npm run build` | Build de produção + service worker (PWA) |
| `npm run preview` | Servir o build localmente |
| `npm run lint` | ESLint |
| `npm test` | Testes (Vitest, modo run) |
| `npm run test:watch` | Testes em watch |
| `npm run seed` | Upsert do `seeds/saints.json` no Supabase |

## Estrutura

```
src/
├─ data/saints.js          Seed local + metadados de tema (ponto de troca p/ Supabase)
├─ theme/tokens.js         Tokens de cor, easing, tamanhos
├─ lib/
│  ├─ supabase.js          Cliente Supabase (anon, read-only)
│  └─ shareCard.js         Geração do card de compartilhamento (canvas)
├─ hooks/
│  ├─ useSaints.js         Fonte de santos (offline-first: cache → seed → Supabase)
│  ├─ useSaintCarousel.js  Navegação, gestos (swipe/tap) e animações
│  └─ useSettings.js       Preferências (tamanho do texto) em localStorage
├─ components/             SaintStage, QuoteCard, MenuSheet, ShareSheet, InfoSheet, …
└─ App.jsx                 Composição

scripts/
├─ seed.js                 Upsert no Supabase (service_role, local)
└─ validateSeed.js         Validação pura do seed (testável)

seeds/saints.json          Conteúdo versionado (fonte do seed)
supabase/schema.sql        Tabela + RLS + bucket (idempotente)
vercel.json                Headers de segurança (CSP, HSTS, …)
```

## Funcionalidades

- **Toque** → próxima citação aleatória · **duplo-toque** → menu · **swipe** → anterior/próxima
- Filtro por tema (Eucaristia, Missa, Liturgia, Oração, Sacramentos, Virtudes)
- Tamanho do texto ajustável (persistido)
- Fonte da citação (obra, autor, página, editora)
- Compartilhar / baixar card gerado por canvas
- Instalável (PWA) e funcional offline

## Conteúdo

Todo o conteúdo é inserido por script, a partir de [`seeds/saints.json`](seeds/saints.json).
Para adicionar/editar um santo: edite o JSON e rode `npm run seed`. Imagens são
enviadas manualmente ao Supabase Storage; veja o [SETUP.md](SETUP.md).

## Segurança

- Chave `anon` no frontend é **pública por design** — protegida pela RLS (só `SELECT`).
- Chave `service_role` fica **só na sua máquina** (`.env`, fora do git, nunca `VITE_`).
- Headers (CSP, HSTS, `X-Frame-Options`, etc.) em [`vercel.json`](vercel.json).
