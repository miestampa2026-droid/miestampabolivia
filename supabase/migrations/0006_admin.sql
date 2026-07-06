-- ============================================================
-- Mi Estampa — 0006_admin.sql
-- Panel de administración (sección 09): rol admin + config de pago
-- ============================================================

-- ── Rol admin (compartido entre las dos socias) ────────────
alter table public.customers add column if not exists is_admin boolean not null default false;

-- ── Config de pago (QR + datos bancarios), fila única ──────
create table if not exists public.payment_config (
  id            uuid primary key default gen_random_uuid(),
  qr_image_url  text,
  bank_name     text,
  bank_holder   text,
  updated_at    timestamptz not null default now()
);

insert into public.payment_config (id)
values ('00000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

drop trigger if exists payment_config_touch_updated_at on public.payment_config;
create trigger payment_config_touch_updated_at
  before update on public.payment_config
  for each row execute function public.touch_updated_at();

alter table public.payment_config enable row level security;

-- Lectura pública: la pantalla de pago la necesita para mostrar el QR
-- y los datos bancarios a cualquier cliente, con o sin sesión.
drop policy if exists payment_config_public_read on public.payment_config;
create policy payment_config_public_read on public.payment_config
  for select using (true);

-- ── RLS admin: acceso total a pedidos (hoy solo vía service_role) ──
drop policy if exists admin_full_access on public.orders;
create policy admin_full_access on public.orders
  for all using (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and is_admin = true)
  )
  with check (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and is_admin = true)
  );

drop policy if exists admin_full_access on public.order_items;
create policy admin_full_access on public.order_items
  for all using (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and is_admin = true)
  )
  with check (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and is_admin = true)
  );
