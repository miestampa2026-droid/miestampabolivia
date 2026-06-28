-- ============================================================
-- Mi Estampa — 0003_orders.sql
-- Modelo de datos: pedidos y items
-- Sección 02 — tercer grupo de tablas
-- ============================================================

-- ── Generador de order_number tipo "ME-2026-0001" ──────────
create sequence if not exists public.orders_seq;

create or replace function public.gen_order_number()
returns text
language plpgsql
as $$
declare
  next_num int;
  year_str text;
begin
  next_num := nextval('public.orders_seq');
  year_str := to_char(now(), 'YYYY');
  return format('ME-%s-%s', year_str, lpad(next_num::text, 4, '0'));
end;
$$;

-- ── Trigger touch_updated_at (reusable) ────────────────────
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Pedidos ────────────────────────────────────────────────
create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  order_number      text not null unique default public.gen_order_number(),
  customer_name     text not null,
  customer_phone    text not null,
  customer_email    text not null,
  delivery_method   text not null check (delivery_method in ('envio','retiro')),
  shipping_zone_id  uuid references public.shipping_zones(id) on delete set null,
  shipping_address  text,
  shipping_cost     numeric(10,2) not null default 0,
  subtotal          numeric(10,2) not null,
  total             numeric(10,2) not null,
  payment_status    text not null default 'pendiente_verificacion'
                    check (payment_status in ('pendiente_verificacion','pagado_confirmado','rechazado')),
  payment_proof_url text,
  order_status      text not null default 'nuevo'
                    check (order_status in ('nuevo','en_produccion','listo','entregado','cancelado')),
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists orders_created_idx        on public.orders(created_at desc);
create index if not exists orders_payment_status_idx on public.orders(payment_status);
create index if not exists orders_order_status_idx   on public.orders(order_status);
create index if not exists orders_email_idx          on public.orders(customer_email);

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

-- ── Items del pedido ───────────────────────────────────────
create table if not exists public.order_items (
  id                    uuid primary key default gen_random_uuid(),
  order_id              uuid not null references public.orders(id) on delete cascade,
  product_id            uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  variants_snapshot     jsonb not null default '{}'::jsonb,
  design_source         text not null check (design_source in ('galeria','subida')),
  design_id             uuid references public.designs(id) on delete set null,
  uploaded_image_url    text,
  preview_image_url     text,
  quantity              int not null check (quantity > 0),
  unit_price            numeric(10,2) not null,
  line_total            numeric(10,2) not null,
  created_at            timestamptz not null default now()
);
create index if not exists order_items_order_idx on public.order_items(order_id);

-- ── RLS: pedidos solo accesibles vía service_role ──────────
-- Sin policies = nadie con anon key puede leer/escribir directo.
-- El checkout pasa por route handlers server-side que usan service_role.
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
