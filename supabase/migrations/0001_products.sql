-- ============================================================
-- Mi Estampa — 0001_products.sql
-- Modelo de datos: categorías, productos y variantes
-- Sección 02 — primer grupo de tablas
-- ============================================================

create extension if not exists "pgcrypto";

-- ── Categorías de producto ─────────────────────────────────
create table if not exists public.products_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  sort_order  int not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── Productos ──────────────────────────────────────────────
create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  category_id      uuid not null references public.products_categories(id) on delete restrict,
  name             text not null,
  description      text,
  base_price       numeric(10,2) not null check (base_price >= 0),
  mockup_image_url text,
  -- Print area en coordenadas relativas 0..1 sobre la imagen mockup
  print_area_x     numeric(4,3) not null default 0.250 check (print_area_x between 0 and 1),
  print_area_y     numeric(4,3) not null default 0.250 check (print_area_y between 0 and 1),
  print_area_w     numeric(4,3) not null default 0.500 check (print_area_w between 0 and 1),
  print_area_h     numeric(4,3) not null default 0.500 check (print_area_h between 0 and 1),
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_active_idx   on public.products(active);

-- ── Variantes (talla, color, tipo de taza, etc.) ───────────
create table if not exists public.product_variants (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  variant_type  text not null,
  variant_value text not null,
  price_delta   numeric(10,2) not null default 0,
  stock         int,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  unique (product_id, variant_type, variant_value)
);
create index if not exists product_variants_product_idx on public.product_variants(product_id);

-- ── Row Level Security ─────────────────────────────────────
-- Catálogo público: SELECT permitido para anon en filas activas.
-- INSERT/UPDATE/DELETE bloqueados (van por service_role o admin authed).
alter table public.products_categories enable row level security;
alter table public.products            enable row level security;
alter table public.product_variants    enable row level security;

drop policy if exists "categorias_select_activas"  on public.products_categories;
drop policy if exists "productos_select_activos"   on public.products;
drop policy if exists "variantes_select_activas"   on public.product_variants;

create policy "categorias_select_activas"
  on public.products_categories for select
  using (active = true);

create policy "productos_select_activos"
  on public.products for select
  using (active = true);

create policy "variantes_select_activas"
  on public.product_variants for select
  using (active = true);
