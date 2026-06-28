# Supabase — Modelo de datos y seed

## Estructura

```
supabase/
  migrations/
    0001_products.sql           # products_categories, products, product_variants
    0002_designs_shipping.sql   # designs, shipping_zones
    0003_orders.sql             # orders, order_items + función gen_order_number + trigger updated_at
  seed.sql                      # 3 categorías, 3 productos, 10 variantes, 6 diseños, 9 zonas
```

## Opción 1: aplicar con los scripts del repo (recomendado para esta etapa)

1. En el panel de Supabase: **Project Settings → Database → Connection string → URI** (modo `Session`).
2. Copiar esa URI en `.env.local` como `SUPABASE_DB_URL`.
3. Correr:

```bash
npm run db:apply   # aplica las 3 migraciones en orden
npm run db:seed    # carga datos de prueba
# o todo de una:
npm run db:reset
```

## Opción 2: SQL Editor de Supabase (manual)

1. Abrir **SQL Editor → New query** en el panel de Supabase.
2. Pegar y ejecutar cada migración en orden (0001 → 0002 → 0003).
3. Pegar y ejecutar `seed.sql`.

## Storage buckets a crear (Storage → New bucket)

| Bucket          | Público | Uso                                                       |
|-----------------|---------|-----------------------------------------------------------|
| `designs`       | Sí      | Diseños predeterminados de la galería (PNG con alpha)     |
| `uploads`       | No      | Imágenes que sube el cliente al personalizar              |
| `previews`      | Sí      | Mockups compuestos generados por Canvas para cada item    |
| `payment-proofs`| No      | Comprobantes de pago QR subidos por el cliente            |
| `mockups`       | Sí      | Fotos base de productos en blanco (para componer preview) |

`designs`, `previews` y `mockups` son públicos porque se referencian desde el HTML del catálogo y los emails de notificación. `uploads` y `payment-proofs` son privados — se acceden vía URLs firmadas server-side.

## Regenerar tipos TypeScript

Cuando las migraciones estén aplicadas en un proyecto real:

```bash
npx supabase gen types typescript --project-id <PROJECT_REF> > src/lib/supabase/types.ts
```

## Notas de diseño

- **`order_number`** se genera por trigger DEFAULT con formato `ME-2026-0001` (función `public.gen_order_number()`).
- **RLS activa en todas las tablas.** Catálogo (`products_categories`, `products`, `product_variants`, `designs`, `shipping_zones`) tiene SELECT público filtrado por `active = true`. Pedidos no tienen policies — solo accesibles vía `service_role` desde route handlers server-side.
- **Mutaciones en catálogo** (alta/edición/baja desde el panel admin) pasan por `service_role`, que bypassa RLS. La auth del panel admin se implementa en sección 09.
