-- ============================================================
-- Mi Estampa — 0002_designs_shipping.sql
-- Modelo de datos: diseños predeterminados y zonas de envío
-- Sección 02 — segundo grupo de tablas
-- ============================================================

-- ── Diseños predeterminados de la galería ──────────────────
create table if not exists public.designs (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,
  name        text not null,
  image_url   text not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists designs_category_idx on public.designs(category) where active = true;

alter table public.designs enable row level security;
drop policy if exists "designs_select_activos" on public.designs;
create policy "designs_select_activos"
  on public.designs for select
  using (active = true);

-- ── Zonas de envío (tabla manual, 9 departamentos) ─────────
create table if not exists public.shipping_zones (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  departamento    text not null,
  cost            numeric(10,2) not null check (cost >= 0),
  estimated_days  text,
  active          boolean not null default true,
  created_at      timestamptz not null default now()
);
create index if not exists shipping_zones_active_idx on public.shipping_zones(active);

alter table public.shipping_zones enable row level security;
drop policy if exists "shipping_zones_select_activas" on public.shipping_zones;
create policy "shipping_zones_select_activas"
  on public.shipping_zones for select
  using (active = true);
