-- ============================================================
-- Mi Estampa — 0005_customers.sql
-- Modelo de datos: cuentas de cliente (sección 12 — Cuentas)
-- ============================================================

-- ── Clientes ────────────────────────────────────────────────
create table if not exists public.customers (
  id            uuid primary key default gen_random_uuid(),
  auth_user_id  uuid unique references auth.users(id) on delete cascade,
  name          text,
  email         text,
  phone         text,
  created_at    timestamptz not null default now()
);
create index if not exists customers_auth_user_idx on public.customers(auth_user_id);

-- ── Direcciones guardadas ───────────────────────────────────
create table if not exists public.customer_addresses (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid not null references public.customers(id) on delete cascade,
  label         text,
  address_line  text not null,
  city          text not null,
  department    text not null,
  reference     text,
  is_default    boolean not null default false,
  created_at    timestamptz not null default now()
);
create index if not exists customer_addresses_customer_idx on public.customer_addresses(customer_id);

-- ── Favoritos (producto o diseño, nunca ambos) ─────────────
create table if not exists public.customer_favorites (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid not null references public.customers(id) on delete cascade,
  product_id    uuid references public.products(id) on delete cascade,
  design_id     uuid references public.designs(id) on delete cascade,
  created_at    timestamptz not null default now(),
  constraint customer_favorites_target_chk check (
    (product_id is not null and design_id is null) or
    (product_id is null and design_id is not null)
  )
);
create index if not exists customer_favorites_customer_idx on public.customer_favorites(customer_id);
create unique index if not exists customer_favorites_product_uniq
  on public.customer_favorites(customer_id, product_id) where product_id is not null;
create unique index if not exists customer_favorites_design_uniq
  on public.customer_favorites(customer_id, design_id) where design_id is not null;

-- ── Vincular pedidos a una cuenta (nullable: checkout invitado sigue existiendo) ──
alter table public.orders add column if not exists customer_id uuid references public.customers(id) on delete set null;
create index if not exists orders_customer_idx on public.orders(customer_id);

-- ── RLS: cada customer ve y edita solo sus propios datos ───
alter table public.customers           enable row level security;
alter table public.customer_addresses  enable row level security;
alter table public.customer_favorites  enable row level security;

drop policy if exists customers_own_data on public.customers;
create policy customers_own_data on public.customers
  for all using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

drop policy if exists addresses_own_data on public.customer_addresses;
create policy addresses_own_data on public.customer_addresses
  for all using (
    customer_id in (select id from public.customers where auth_user_id = auth.uid())
  )
  with check (
    customer_id in (select id from public.customers where auth_user_id = auth.uid())
  );

drop policy if exists favorites_own_data on public.customer_favorites;
create policy favorites_own_data on public.customer_favorites
  for all using (
    customer_id in (select id from public.customers where auth_user_id = auth.uid())
  )
  with check (
    customer_id in (select id from public.customers where auth_user_id = auth.uid())
  );

-- ── Trigger: crear fila en customers automáticamente al registrarse ──
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.customers (auth_user_id, email, name, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    nullif(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
