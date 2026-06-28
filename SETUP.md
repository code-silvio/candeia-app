# Candeia — Setup (Supabase + PWA + Deploy)

App devocional católico: React + Vite (PWA offline), conteúdo no **Supabase**
(Postgres + Storage), deploy na **Vercel**. Sem login, somente leitura.

## 1. Criar o projeto Supabase

1. Crie um projeto em <https://supabase.com>.
2. No **SQL Editor**, cole e rode [`supabase/schema.sql`](supabase/schema.sql).
   Ele cria a tabela `saints` (com RLS read-only para o público) e o bucket
   público `saints-images`.

## 2. Pegar as chaves

Em **Project Settings → API**:

| Chave | Onde usar | Segredo? |
|---|---|---|
| Project URL | `.env` (frontend e script) | não |
| `anon` public | frontend (`VITE_SUPABASE_ANON_KEY`) | **não** — pública por design; protegida pela RLS |
| `service_role` | só o script de seed (`SUPABASE_SERVICE_ROLE_KEY`) | **SIM** — nunca commitar, nunca no frontend |

## 3. Configurar `.env`

```bash
cp .env.example .env
# preencha os 4 valores
```

## 4. Popular o conteúdo (script local)

A fonte versionada é [`seeds/saints.json`](seeds/saints.json). Para inserir/atualizar:

```bash
npm run seed
```

> Faz `upsert` por `id` usando a `service_role` (ignora a RLS). Valida ids,
> campos obrigatórios e `themeValue` antes de escrever. Rode sempre que editar
> o JSON.

## 5. Imagens dos santos

Upload **manual** no Supabase Studio → Storage → bucket `saints-images`.
Depois copie a **URL pública** e cole no campo `image` do santo em
`seeds/saints.json` (ex.: `https://SEU-PROJETO.supabase.co/storage/v1/object/public/saints-images/sao-bento.png`)
e rode `npm run seed` de novo.

> As 3 imagens locais em `public/assets/` são placeholders de dev. Em produção
> o `image` deve apontar para o Storage.

## 6. Rodar local

```bash
npm install
npm run dev      # http://localhost:5173 (usa o seed local se .env não tiver Supabase)
```

Sem `.env` configurado, o app cai no **seed local** — continua funcionando para
desenvolvimento e offline.

## 7. Deploy na Vercel

1. Importe o repo na Vercel (framework detectado: **Vite**).
2. Em **Environment Variables**, adicione **apenas** as públicas:
   `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
   **Não** adicione a `service_role` na Vercel.
3. Os headers de segurança (CSP, HSTS, etc.) já estão em
   [`vercel.json`](vercel.json).

## Scripts

| Comando | O quê |
|---|---|
| `npm run dev` | Dev server (Vite) |
| `npm run build` | Build de produção + service worker (PWA) |
| `npm run preview` | Servir o build localmente |
| `npm run lint` | ESLint |
| `npm run seed` | Upsert do `seeds/saints.json` no Supabase |

## Arquitetura (resumo)

```
React PWA (Vercel) ──SELECT (anon, RLS read-only)──▶ Supabase Postgres (saints)
       │                                              Supabase Storage (imagens)
       └─ offline: service worker (app shell + cache de dados/imagens)
                                  ▲
        scripts/seed.js (local, service_role) ──UPSERT──┘
```

> ⚠️ A `anon key` é pública (vai no bundle). A segurança vem da **RLS**
> (só SELECT para o público). A `service_role` fica **só na sua máquina**.
