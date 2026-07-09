-- ============================================================
-- Mi Estampa — 0007_catalog_admin.sql
-- RLS admin sobre el catálogo (para el panel /admin) +
-- llaves naturales estables en designs/shipping_zones (para
-- poder hacer upsert seguro desde scripts/db-seed-catalog.mjs
-- sin nunca tocar orders/customers).
-- ============================================================

-- ── Llaves naturales únicas (permiten ON CONFLICT sin depender
--    de gen_random_uuid(), que cambia en cada TRUNCATE+reinsert) ──
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'designs_name_unique') then
    alter table public.designs add constraint designs_name_unique unique (name);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'shipping_zones_departamento_unique') then
    alter table public.shipping_zones add constraint shipping_zones_departamento_unique unique (departamento);
  end if;
end $$;

-- ── RLS: admin (is_admin=true) puede escribir todo el catálogo ──
-- Mismo patrón que orders/order_items (migración 0006): la lectura
-- pública ya existe (solo filas active=true); esto agrega
-- lectura+escritura total para admins autenticados.
drop policy if exists admin_full_access on public.products_categories;
create policy admin_full_access on public.products_categories
  for all using (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and is_admin = true)
  )
  with check (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and is_admin = true)
  );

drop policy if exists admin_full_access on public.products;
create policy admin_full_access on public.products
  for all using (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and is_admin = true)
  )
  with check (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and is_admin = true)
  );

drop policy if exists admin_full_access on public.product_variants;
create policy admin_full_access on public.product_variants
  for all using (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and is_admin = true)
  )
  with check (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and is_admin = true)
  );

drop policy if exists admin_full_access on public.designs;
create policy admin_full_access on public.designs
  for all using (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and is_admin = true)
  )
  with check (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and is_admin = true)
  );

drop policy if exists admin_full_access on public.shipping_zones;
create policy admin_full_access on public.shipping_zones
  for all using (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and is_admin = true)
  )
  with check (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and is_admin = true)
  );
