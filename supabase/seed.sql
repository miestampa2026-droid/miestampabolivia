-- ============================================================
-- Mi Estampa — seed.sql
-- Datos de prueba: 3 categorías, 3 productos, 10 variantes,
-- 6 diseños de galería, 9 zonas de envío.
-- Idempotente: truncate + reinsert.
-- ============================================================

truncate
  public.order_items,
  public.orders,
  public.product_variants,
  public.products,
  public.products_categories,
  public.designs,
  public.shipping_zones
  restart identity cascade;

alter sequence if exists public.orders_seq restart with 1;

-- ── Categorías ─────────────────────────────────────────────
insert into public.products_categories (id, name, slug, sort_order) values
  ('11111111-1111-1111-1111-111111111111', 'Poleras', 'poleras', 1),
  ('22222222-2222-2222-2222-222222222222', 'Gorras',  'gorras',  2),
  ('33333333-3333-3333-3333-333333333333', 'Tazas',   'tazas',   3);

-- ── Productos ──────────────────────────────────────────────
insert into public.products
  (id, category_id, name, description, base_price, mockup_image_url,
   print_area_x, print_area_y, print_area_w, print_area_h)
values
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '11111111-1111-1111-1111-111111111111',
   'Polera algodón cuello redondo',
   'Polera 100% algodón peinado 180g. Cuello redondo, costura reforzada. Ideal para estampado serigráfico o sublimado.',
   90.00,
   '/mockups/polera-blanca.svg',
   0.330, 0.260, 0.340, 0.380),

  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
   '22222222-2222-2222-2222-222222222222',
   'Gorra trucker',
   'Gorra trucker frente algodón, espalda en malla transpirable, cierre snapback ajustable.',
   75.00,
   '/mockups/gorra-blanca.svg',
   0.300, 0.330, 0.400, 0.260),

  ('cccc3333-cccc-cccc-cccc-cccccccccccc',
   '33333333-3333-3333-3333-333333333333',
   'Taza cerámica 11 oz',
   'Taza de cerámica blanca apta para sublimación. 11 oz.',
   55.00,
   '/mockups/taza-blanca.svg',
   0.280, 0.250, 0.460, 0.500);

-- ── Variantes ──────────────────────────────────────────────
insert into public.product_variants (product_id, variant_type, variant_value, price_delta) values
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'talla', 'S',  0),
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'talla', 'M',  0),
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'talla', 'L',  0),
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'talla', 'XL', 5),
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'color', 'Blanco', 0),
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'color', 'Negro',  10),
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'color', 'Blanco', 0),
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'color', 'Negro',  0),
  ('cccc3333-cccc-cccc-cccc-cccccccccccc', 'tipo_taza', 'Estándar', 0),
  ('cccc3333-cccc-cccc-cccc-cccccccccccc', 'tipo_taza', 'Mágica',   25);

-- ── Diseños de la galería ──────────────────────────────────
insert into public.designs (category, name, image_url) values
  ('Frases',   'Vive con estampa',  '/designs/frases-vive.svg'),
  ('Frases',   'Camba 100%',        '/designs/frases-camba.svg'),
  ('Animales', 'Llama en el cielo', '/designs/animales-llama.svg'),
  ('Animales', 'Jaguar boliviano',  '/designs/animales-jaguar.svg'),
  ('Carnaval', 'Diablada',          '/designs/carnaval-diablada.svg'),
  ('Deportes', 'Verde la franja',   '/designs/deportes-franja.svg');

-- ── Zonas de envío (placeholder, confirmar con socias) ─────
insert into public.shipping_zones (name, departamento, cost, estimated_days) values
  ('Santa Cruz ciudad',  'Santa Cruz',  15.00, '1-2 días'),
  ('La Paz',             'La Paz',      35.00, '3-5 días'),
  ('Cochabamba',         'Cochabamba',  30.00, '3-5 días'),
  ('Sucre / Chuquisaca', 'Chuquisaca',  40.00, '4-6 días'),
  ('Oruro',              'Oruro',       35.00, '3-5 días'),
  ('Potosí',             'Potosí',      45.00, '4-6 días'),
  ('Tarija',             'Tarija',      45.00, '4-6 días'),
  ('Beni',               'Beni',        55.00, '5-7 días'),
  ('Pando',              'Pando',       65.00, '6-9 días');
