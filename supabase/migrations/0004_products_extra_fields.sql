-- ============================================================
-- Mi Estampa — 0004_products_extra_fields.sql
-- Agrega columnas reales que hasta ahora se resolvían con
-- heurísticas en el frontend (lib/productMockupMap.ts):
--   - technique: técnica de impresión ('Sublimación','Serigrafía','DTF','Bordado')
--   - mockup_type: tipo de <ProductMockup /> ('polera','blusa','gorra','taza','sueter','totebag')
--   - badge: etiqueta promocional opcional ('Más vendido','Nuevo', null)
-- ============================================================

alter table public.products
  add column if not exists technique   text,
  add column if not exists mockup_type text,
  add column if not exists badge       text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'products_mockup_type_check'
  ) then
    alter table public.products
      add constraint products_mockup_type_check
      check (mockup_type is null or mockup_type in ('polera','blusa','gorra','taza','sueter','totebag'));
  end if;
end $$;
