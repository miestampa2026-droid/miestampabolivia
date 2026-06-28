# Mi Estampa

App web de personalización textil para Bolivia. MVP v1.

> Taller de serigrafía/sublimación. El cliente elige producto, elige o sube diseño, ve un preview automático, paga por QR (confirmación manual) y recibe en su zona o retira en local. Las socias gestionan los pedidos desde un panel admin.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Supabase** (Postgres + Storage + Auth)
- **Tailwind CSS** + Shadcn UI
- **Resend** para correos
- **Vercel** para deploy

## Setup local

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno y llenar
cp .env.example .env.local

# 3. Aplicar migraciones y seed a tu Supabase (requiere SUPABASE_DB_URL)
npm run db:apply
npm run db:seed

# 4. Levantar dev server
npm run dev
```

App disponible en http://localhost:3000.

## Estructura

```
src/
  app/                  # rutas App Router
    layout.tsx          # fuentes (Plus Jakarta Sans + Nunito) + metadata
    page.tsx            # landing v0
    globals.css         # tokens del brand + reset
    icon.svg            # favicon
  lib/
    utils.ts            # cn() helper (Shadcn)
    supabase/
      client.ts         # cliente browser (anon key)
      admin.ts          # cliente service-role (server-only)
      types.ts          # tipos generados (placeholder)
  components/           # componentes UI (se irán agregando)

supabase/
  migrations/           # SQL ordenado por timestamp
    0001_products.sql
    0002_designs_shipping.sql
    0003_orders.sql
  seed.sql              # datos de prueba (3 productos, 6 diseños, 9 zonas)
  README.md             # cómo aplicar las migraciones

scripts/
  db-apply.mjs          # aplica todas las migraciones
  db-seed.mjs           # carga el seed

docs/
  SPEC_Tecnica_App_Personalizacion.md
  MiEstampa_BrandGuide_ClauCode.md
```

## Documentación

- [Spec técnica](docs/SPEC_Tecnica_App_Personalizacion.md)
- [Guía de marca](docs/MiEstampa_BrandGuide_ClauCode.md)
- [Cómo aplicar migraciones](supabase/README.md)

## Reglas de oro

- **Mobile-first**: probar en 375px antes de cualquier breakpoint mayor.
- **Variables CSS, no colores hardcodeados**: usar `bg-coral`, `text-charcoal`, etc. Nunca `bg-[#F05A4F]`.
- **El preview NO es editor**: composición automática producto + diseño en zona fija.
- **Pago QR con verificación MANUAL**: las socias confirman desde el panel.
- **Validación de imagen por dimensiones en píxeles** (mín 1500, óptimo 2000+), no por DPI.

## Tablero de tareas

Asana proyecto `1215974541770252`. Construir sección por sección en orden (00→10). Entregar MVP navegable al terminar sección 07 antes de pulir admin.
