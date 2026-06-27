-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  Candeia — schema do Supabase                                              ║
-- ║  Rode este SQL uma vez no SQL Editor do projeto Supabase.                  ║
-- ║  Idempotente: pode rodar de novo sem quebrar.                              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- ── Tabela de conteúdo ────────────────────────────────────────────────────────
create table if not exists public.saints (
  id          bigint primary key,
  name        text        not null,
  age         text,
  theme_value text        not null,
  image_url   text,
  quote       text        not null,
  source      jsonb       not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Garante que o tema seja um dos valores conhecidos pela UI.
alter table public.saints drop constraint if exists saints_theme_value_check;
alter table public.saints add constraint saints_theme_value_check
  check (theme_value in ('eucaristia', 'missa', 'liturgia', 'oracao', 'sacramentos', 'virtudes'));

-- ── RLS: leitura pública, escrita bloqueada ──────────────────────────────────
-- Sem policy de INSERT/UPDATE/DELETE → o público (anon) não escreve.
-- O script de seed usa a SERVICE_ROLE key, que ignora RLS.
alter table public.saints enable row level security;

drop policy if exists "saints_public_read" on public.saints;
create policy "saints_public_read"
  on public.saints
  for select
  to anon, authenticated
  using (true);

-- ── Storage: bucket público de imagens ───────────────────────────────────────
-- Upload é manual (Supabase Studio); o app/seed só referencia a URL pública.
insert into storage.buckets (id, name, public)
values ('saints-images', 'saints-images', true)
on conflict (id) do nothing;

drop policy if exists "saints_images_public_read" on storage.objects;
create policy "saints_images_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'saints-images');
