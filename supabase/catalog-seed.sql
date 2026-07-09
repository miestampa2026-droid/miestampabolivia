-- ============================================================
-- Mi Estampa — catalog-seed.sql
-- Carga/actualiza SOLO catálogo: categorías, productos,
-- variantes, diseños, zonas de envío.
--
-- A DIFERENCIA de seed.sql: nunca hace TRUNCATE. Todo es
-- upsert (ON CONFLICT). Seguro de correr en cualquier momento,
-- incluso con pedidos y clientes reales ya cargados — nunca
-- toca orders, order_items, customers, customer_addresses ni
-- customer_favorites, ni directa ni indirectamente (un TRUNCATE
-- con CASCADE sobre products/designs sí las arrastraría por las
-- FK; un upsert no borra nada, así que no hay ese riesgo).
-- ============================================================

-- ── Categorías ─────────────────────────────────────────────
insert into public.products_categories (id, name, slug, sort_order) values
  ('11111111-1111-1111-1111-111111111111', 'Poleras',      'poleras',      1),
  ('22222222-2222-2222-2222-222222222222', 'Gorras',       'gorras',       2),
  ('33333333-3333-3333-3333-333333333333', 'Tazas',        'tazas',        3),
  ('44444444-4444-4444-4444-444444444444', 'Blusas Mujer', 'blusas-mujer', 4),
  ('55555555-5555-5555-5555-555555555555', 'Suéteres',     'sueteres',     5),
  ('66666666-6666-6666-6666-666666666666', 'Tote Bags',    'tote-bags',    6)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  sort_order = excluded.sort_order,
  active = true;

-- ── Productos ──────────────────────────────────────────────
insert into public.products
  (id, category_id, name, description, base_price, mockup_image_url,
   print_area_x, print_area_y, print_area_w, print_area_h,
   technique, mockup_type, badge)
values
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '11111111-1111-1111-1111-111111111111',
   'Polera algodón cuello redondo',
   'Polera 100% algodón peinado 180g. Cuello redondo, costura reforzada. Ideal para estampado serigráfico o sublimado.',
   90.00, 'https://ywykaivywtvcucedxnoc.supabase.co/storage/v1/object/public/product-mockups/polera-hombre.png',
   0.350, 0.320, 0.300, 0.320,
   'Serigrafía', 'polera', null),

  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
   '22222222-2222-2222-2222-222222222222',
   'Gorra trucker',
   'Gorra trucker frente algodón, espalda en malla transpirable, cierre snapback ajustable.',
   75.00, 'https://ywykaivywtvcucedxnoc.supabase.co/storage/v1/object/public/product-mockups/gorra.png',
   0.300, 0.330, 0.400, 0.260,
   'Sublimación', 'gorra', null),

  ('cccc3333-cccc-cccc-cccc-cccccccccccc',
   '33333333-3333-3333-3333-333333333333',
   'Taza cerámica 11 oz',
   'Taza de cerámica blanca apta para sublimación. 11 oz.',
   55.00, 'https://ywykaivywtvcucedxnoc.supabase.co/storage/v1/object/public/product-mockups/taza.png',
   0.280, 0.250, 0.460, 0.500,
   'Sublimación', 'taza', null),

  ('dddd1111-dddd-dddd-dddd-dddddddddddd',
   '11111111-1111-1111-1111-111111111111',
   'Polera Deportiva Sublimada',
   'Polera técnica de poliéster, transpirable, ideal para diseños fotográficos a color completo.',
   120.00, 'https://ywykaivywtvcucedxnoc.supabase.co/storage/v1/object/public/product-mockups/polera-hombre.png',
   0.350, 0.320, 0.300, 0.320,
   'Sublimación', 'polera', 'Más vendido'),

  ('dddd2222-dddd-dddd-dddd-dddddddddddd',
   '11111111-1111-1111-1111-111111111111',
   'Polera Básica Algodón',
   'Polera de algodón 100%, corte clásico, la opción más versátil para estampado serigráfico.',
   80.00, 'https://ywykaivywtvcucedxnoc.supabase.co/storage/v1/object/public/product-mockups/polera-mujer.png',
   0.350, 0.320, 0.300, 0.320,
   'Serigrafía', 'polera', 'Más vendido'),

  ('dddd3333-dddd-dddd-dddd-dddddddddddd',
   '11111111-1111-1111-1111-111111111111',
   'Polera Oversize',
   'Corte oversize amplio, algodón grueso 220g. Tendencia streetwear.',
   110.00, 'https://ywykaivywtvcucedxnoc.supabase.co/storage/v1/object/public/product-mockups/polera-hombre.png',
   0.350, 0.320, 0.300, 0.320,
   'DTF', 'polera', 'Nuevo'),

  ('eeee1111-eeee-eeee-eeee-eeeeeeeeeeee',
   '44444444-4444-4444-4444-444444444444',
   'Blusa Mujer Cuello V',
   'Blusa entallada cuello V, tela suave de poliéster apta para sublimación.',
   95.00, 'https://ywykaivywtvcucedxnoc.supabase.co/storage/v1/object/public/product-mockups/blusa-mujer-cuello-v.png',
   0.350, 0.320, 0.300, 0.320,
   'Sublimación', 'blusa', 'Nuevo'),

  ('eeee2222-eeee-eeee-eeee-eeeeeeeeeeee',
   '44444444-4444-4444-4444-444444444444',
   'Blusa Manga Larga',
   'Blusa manga larga entallada, ideal para diseños DTF de alta definición.',
   115.00, 'https://ywykaivywtvcucedxnoc.supabase.co/storage/v1/object/public/product-mockups/blusa-manga-larga.png',
   0.350, 0.320, 0.300, 0.320,
   'DTF', 'blusa', null),

  ('ffff1111-ffff-ffff-ffff-ffffffffffff',
   '22222222-2222-2222-2222-222222222222',
   'Gorra Curva Bordada',
   'Gorra visera curva con bordado 3D, estructura reforzada.',
   85.00, 'https://ywykaivywtvcucedxnoc.supabase.co/storage/v1/object/public/product-mockups/gorra.png',
   0.300, 0.330, 0.400, 0.260,
   'Bordado', 'gorra', null),

  ('99991111-9999-9999-9999-999999999999',
   '33333333-3333-3333-3333-333333333333',
   'Taza Mágica',
   'Taza cerámica negra que revela el diseño a color al contacto con líquido caliente.',
   75.00, 'https://ywykaivywtvcucedxnoc.supabase.co/storage/v1/object/public/product-mockups/taza.png',
   0.280, 0.250, 0.460, 0.500,
   'Sublimación', 'taza', 'Nuevo'),

  ('88881111-8888-8888-8888-888888888888',
   '55555555-5555-5555-5555-555555555555',
   'Suéter Cuello Redondo',
   'Suéter frisado cuello redondo, ideal para diseños grandes en la espalda o el pecho.',
   160.00, 'https://ywykaivywtvcucedxnoc.supabase.co/storage/v1/object/public/product-mockups/sueter-hombre.png',
   0.350, 0.320, 0.300, 0.320,
   'DTF', 'sueter', 'Nuevo'),

  ('77771111-7777-7777-7777-777777777777',
   '66666666-6666-6666-6666-666666666666',
   'Tote Bag Algodón',
   'Bolso tote de algodón grueso resistente, asas reforzadas.',
   65.00, 'https://ywykaivywtvcucedxnoc.supabase.co/storage/v1/object/public/product-mockups/tote-bag-algodon.png',
   0.350, 0.500, 0.300, 0.300,
   'Serigrafía', 'totebag', null)
on conflict (id) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  base_price = excluded.base_price,
  mockup_image_url = excluded.mockup_image_url,
  print_area_x = excluded.print_area_x,
  print_area_y = excluded.print_area_y,
  print_area_w = excluded.print_area_w,
  print_area_h = excluded.print_area_h,
  technique = excluded.technique,
  mockup_type = excluded.mockup_type,
  badge = excluded.badge,
  active = true;

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
  ('cccc3333-cccc-cccc-cccc-cccccccccccc', 'tipo_taza', 'Mágica',   25),

  ('dddd1111-dddd-dddd-dddd-dddddddddddd', 'talla', 'S',  0),
  ('dddd1111-dddd-dddd-dddd-dddddddddddd', 'talla', 'M',  0),
  ('dddd1111-dddd-dddd-dddd-dddddddddddd', 'talla', 'L',  0),
  ('dddd1111-dddd-dddd-dddd-dddddddddddd', 'talla', 'XL', 5),
  ('dddd1111-dddd-dddd-dddd-dddddddddddd', 'color', 'Blanco', 0),
  ('dddd1111-dddd-dddd-dddd-dddddddddddd', 'color', 'Azul',   0),
  ('dddd1111-dddd-dddd-dddd-dddddddddddd', 'color', 'Negro',  0),

  ('dddd2222-dddd-dddd-dddd-dddddddddddd', 'talla', 'S',  0),
  ('dddd2222-dddd-dddd-dddd-dddddddddddd', 'talla', 'M',  0),
  ('dddd2222-dddd-dddd-dddd-dddddddddddd', 'talla', 'L',  0),
  ('dddd2222-dddd-dddd-dddd-dddddddddddd', 'talla', 'XL', 5),
  ('dddd2222-dddd-dddd-dddd-dddddddddddd', 'color', 'Blanco', 0),
  ('dddd2222-dddd-dddd-dddd-dddddddddddd', 'color', 'Negro',  0),
  ('dddd2222-dddd-dddd-dddd-dddddddddddd', 'color', 'Gris',   0),
  ('dddd2222-dddd-dddd-dddd-dddddddddddd', 'color', 'Rojo',   0),

  ('dddd3333-dddd-dddd-dddd-dddddddddddd', 'talla', 'S',  0),
  ('dddd3333-dddd-dddd-dddd-dddddddddddd', 'talla', 'M',  0),
  ('dddd3333-dddd-dddd-dddd-dddddddddddd', 'talla', 'L',  0),
  ('dddd3333-dddd-dddd-dddd-dddddddddddd', 'talla', 'XL', 5),
  ('dddd3333-dddd-dddd-dddd-dddddddddddd', 'color', 'Blanco', 0),
  ('dddd3333-dddd-dddd-dddd-dddddddddddd', 'color', 'Negro',  0),
  ('dddd3333-dddd-dddd-dddd-dddddddddddd', 'color', 'Beige',  0),

  ('eeee1111-eeee-eeee-eeee-eeeeeeeeeeee', 'talla', 'S', 0),
  ('eeee1111-eeee-eeee-eeee-eeeeeeeeeeee', 'talla', 'M', 0),
  ('eeee1111-eeee-eeee-eeee-eeeeeeeeeeee', 'talla', 'L', 0),
  ('eeee1111-eeee-eeee-eeee-eeeeeeeeeeee', 'color', 'Blanco', 0),
  ('eeee1111-eeee-eeee-eeee-eeeeeeeeeeee', 'color', 'Rosa',   0),
  ('eeee1111-eeee-eeee-eeee-eeeeeeeeeeee', 'color', 'Negro',  0),

  ('eeee2222-eeee-eeee-eeee-eeeeeeeeeeee', 'talla', 'S', 0),
  ('eeee2222-eeee-eeee-eeee-eeeeeeeeeeee', 'talla', 'M', 0),
  ('eeee2222-eeee-eeee-eeee-eeeeeeeeeeee', 'talla', 'L', 0),
  ('eeee2222-eeee-eeee-eeee-eeeeeeeeeeee', 'color', 'Blanco', 0),
  ('eeee2222-eeee-eeee-eeee-eeeeeeeeeeee', 'color', 'Negro',  0),
  ('eeee2222-eeee-eeee-eeee-eeeeeeeeeeee', 'color', 'Beige',  0),

  ('ffff1111-ffff-ffff-ffff-ffffffffffff', 'color', 'Negro',       0),
  ('ffff1111-ffff-ffff-ffff-ffffffffffff', 'color', 'Azul marino', 0),
  ('ffff1111-ffff-ffff-ffff-ffffffffffff', 'color', 'Rojo',        0),

  ('99991111-9999-9999-9999-999999999999', 'tipo_taza', 'Mágica', 0),
  ('99991111-9999-9999-9999-999999999999', 'color', 'Negro', 0),

  ('88881111-8888-8888-8888-888888888888', 'talla', 'S',  0),
  ('88881111-8888-8888-8888-888888888888', 'talla', 'M',  0),
  ('88881111-8888-8888-8888-888888888888', 'talla', 'L',  0),
  ('88881111-8888-8888-8888-888888888888', 'talla', 'XL', 8),
  ('88881111-8888-8888-8888-888888888888', 'color', 'Gris',  0),
  ('88881111-8888-8888-8888-888888888888', 'color', 'Negro', 0),
  ('88881111-8888-8888-8888-888888888888', 'color', 'Beige', 0),

  ('77771111-7777-7777-7777-777777777777', 'color', 'Natural', 0),
  ('77771111-7777-7777-7777-777777777777', 'color', 'Negro',   0)
on conflict (product_id, variant_type, variant_value) do update set
  price_delta = excluded.price_delta,
  active = true;

-- ── Diseños de la galería ──────────────────────────────────
insert into public.designs (category, name, image_url) values
  ('Frases',   'Vive con estampa',  '/designs/frases-vive.svg'),
  ('Frases',   'Camba 100%',        '/designs/frases-camba.svg'),
  ('Animales', 'Llama en el cielo', '/designs/animales-llama.svg'),
  ('Animales', 'Jaguar boliviano',  '/designs/animales-jaguar.svg'),
  ('Carnaval', 'Diablada',          '/designs/carnaval-diablada.svg'),
  ('Deportes', 'Verde la franja',   '/designs/deportes-franja.svg')
on conflict (name) do update set
  category = excluded.category,
  image_url = excluded.image_url,
  active = true;

-- ── Zonas de envío ─────────────────────────────────────────
insert into public.shipping_zones (name, departamento, cost, estimated_days) values
  ('Santa Cruz ciudad',  'Santa Cruz',  15.00, '1-2 días'),
  ('La Paz',             'La Paz',      35.00, '3-5 días'),
  ('Cochabamba',         'Cochabamba',  30.00, '3-5 días'),
  ('Sucre / Chuquisaca', 'Chuquisaca',  40.00, '4-6 días'),
  ('Oruro',              'Oruro',       35.00, '3-5 días'),
  ('Potosí',             'Potosí',      45.00, '4-6 días'),
  ('Tarija',             'Tarija',      45.00, '4-6 días'),
  ('Beni',               'Beni',        55.00, '5-7 días'),
  ('Pando',              'Pando',       65.00, '6-9 días')
on conflict (departamento) do update set
  name = excluded.name,
  cost = excluded.cost,
  estimated_days = excluded.estimated_days,
  active = true;
