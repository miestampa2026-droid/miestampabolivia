# ESPECIFICACIÓN TÉCNICA — App Web de Personalización Textil
## Proyecto: [Camba Print Studio] · Bolivia · MVP v1

> Documento de especificación listo para entregar a Claude Code.
> Última actualización: Junio 2026

---

## 0. CONTEXTO DEL NEGOCIO (leer antes de codear)

Taller de serigrafía/sublimación en Bolivia (cobertura nacional desde el día 1). El negocio imprime diseños sobre prendas y accesorios (poleras, suéteres, gorras, tazas, etc.). Esta app web es el **canal de venta y toma de pedidos online**, algo que según el cliente no existe actualmente en Bolivia.

**Objetivo del MVP:** que un cliente pueda, en su celular, elegir un producto, elegir o subir un diseño, ver un preview de cómo quedaría, pagar por QR, e indicar entrega o retiro — y que la dueña reciba el pedido para producirlo.

**Quién opera:** dos socias. Una gestiona producción, otra gestiona redes/ventas. Reciben pedidos por correo + WhatsApp.

---

## 1. ALCANCE DEL MVP (qué SÍ y qué NO)

### SÍ incluye (v1)
- Catálogo de productos por categoría (polera, suéter, gorra, taza, etc.)
- Selección de variantes: talla, color de prenda, tipo de taza, etc.
- Galería de diseños predeterminados organizados por categoría
- Subida de imagen propia del cliente CON validación automática de calidad/resolución
- **Preview compuesto automático** (NO editor): producto + diseño superpuesto en zona fija predefinida → imagen de cómo se vería. Sin arrastrar, girar ni escalar.
- Carrito de compra
- Checkout con: datos del cliente, dirección, elección entre ENVÍO o RETIRO EN LOCAL
- Cálculo de costo de envío por zona/departamento (tabla manual configurable)
- Pago por **QR con confirmación manual** (ver sección 6 — crítico)
- Notificación de pedido a las socias por **correo (Resend) + WhatsApp**
- Panel de administración mínimo para que las socias vean pedidos y cambien su estado

### NO incluye (queda para v2+)
- Editor visual interactivo (arrastrar/rotar/escalar el diseño)
- Integración con pasarela de pago automática / webhooks bancarios
- Integración con API de couriers (el envío es tabla manual)
- App móvil nativa (esto es web responsive, mobile-first)
- Cuentas de usuario / login de clientes (checkout como invitado en v1)
- Programa de descuentos/cupones

---

## 2. STACK TÉCNICO

| Capa | Tecnología | Notas |
|------|-----------|-------|
| Framework | **Next.js 14** (App Router) | SSR + API routes |
| Base de datos | **Supabase** (Postgres) | Tablas + Storage para imágenes |
| Storage de imágenes | **Supabase Storage** | Diseños predeterminados + imágenes subidas por clientes |
| Correo | **Resend** | Notificación de pedidos |
| WhatsApp | **WhatsApp Business API** o link `wa.me` con mensaje pre-armado | Empezar con `wa.me`/Click-to-Chat si la API formal se complica |
| UI | **Tailwind CSS + Shadcn UI** | Consistente con otros proyectos |
| Hosting | **Vercel** | Deploy directo |
| Preview de imagen | **Canvas API** (cliente) o composición CSS | Genera el mockup automáticamente |

> Nota: este stack es deliberadamente idéntico al que ya se usa en otros proyectos (Nexum One, GUARDIUM) para reaprovechar conocimiento.

---

## 3. MODELO DE DATOS (Supabase)

```sql
-- Categorías de producto
products_categories (
  id uuid pk,
  name text,             -- "Poleras", "Tazas", "Gorras"
  slug text unique,
  sort_order int,
  active boolean default true
)

-- Productos
products (
  id uuid pk,
  category_id uuid fk,
  name text,             -- "Polera algodón cuello redondo"
  description text,
  base_price numeric,    -- precio base en Bs.
  mockup_image_url text, -- foto del producto en blanco para componer el preview
  -- zona donde se superpone el diseño en el mockup (coordenadas relativas 0-1)
  print_area_x numeric,  -- ej. 0.30
  print_area_y numeric,  -- ej. 0.28
  print_area_w numeric,  -- ej. 0.40
  print_area_h numeric,  -- ej. 0.35
  active boolean default true
)

-- Variantes (talla, color, tipo)
product_variants (
  id uuid pk,
  product_id uuid fk,
  variant_type text,     -- "talla" | "color" | "tipo_taza"
  variant_value text,    -- "M", "Negro", "Mágica"
  price_delta numeric default 0, -- sobreprecio si aplica
  stock int default null -- null = no se controla stock en v1
)

-- Diseños predeterminados de la galería
designs (
  id uuid pk,
  category text,         -- "Frases", "Deportes", "Animales", "Carnaval"
  name text,
  image_url text,        -- PNG con transparencia, alta resolución
  active boolean default true
)

-- Zonas de envío (tabla manual)
shipping_zones (
  id uuid pk,
  name text,             -- "Santa Cruz ciudad", "La Paz", "Interior - resto"
  departamento text,
  cost numeric,          -- costo de envío en Bs.
  estimated_days text,   -- "1-2 días", "3-5 días"
  active boolean default true
)

-- Pedidos
orders (
  id uuid pk,
  order_number text unique, -- legible: "CPS-2026-0001"
  customer_name text,
  customer_phone text,      -- WhatsApp del cliente
  customer_email text,
  delivery_method text,     -- "envio" | "retiro"
  shipping_zone_id uuid fk null,
  shipping_address text null,
  shipping_cost numeric default 0,
  subtotal numeric,
  total numeric,
  payment_status text default 'pendiente_verificacion',
    -- 'pendiente_verificacion' | 'pagado_confirmado' | 'rechazado'
  order_status text default 'nuevo',
    -- 'nuevo' | 'en_produccion' | 'listo' | 'entregado' | 'cancelado'
  created_at timestamptz default now()
)

-- Items del pedido (cada producto personalizado)
order_items (
  id uuid pk,
  order_id uuid fk,
  product_id uuid fk,
  product_name_snapshot text, -- nombre al momento de compra
  variants_snapshot jsonb,    -- {"talla":"M","color":"Negro"}
  design_source text,         -- "galeria" | "subida"
  design_id uuid fk null,     -- si vino de galería
  uploaded_image_url text null, -- si la subió el cliente
  preview_image_url text,     -- el mockup compuesto que vio/aprobó
  quantity int,
  unit_price numeric,
  line_total numeric
)
```

---

## 4. FLUJO DEL USUARIO (cliente)

```
1. Landing / Catálogo
   └─ Ve categorías y productos. Mobile-first.

2. Selecciona un producto
   └─ Elige variantes (talla, color, tipo)

3. Elige diseño — DOS caminos:
   ├─ (A) Galería predeterminada → filtra por categoría → selecciona
   └─ (B) Sube su propia imagen
          └─ VALIDACIÓN automática de calidad (sección 5)
             ├─ Si pasa → continúa
             └─ Si falla → mensaje claro + permite reintentar

4. PREVIEW automático
   └─ Se genera y muestra la imagen: producto + diseño en zona fija.
      El cliente lo aprueba. (Sin edición.)

5. Agrega al carrito → puede seguir comprando o ir a checkout

6. Checkout
   ├─ Datos: nombre, teléfono (WhatsApp), email
   ├─ Método: ENVÍO o RETIRO EN LOCAL
   │   └─ Si envío → selecciona zona/departamento → calcula costo
   └─ Resumen: subtotal + envío = total

7. Pago QR
   └─ Muestra el QR. Cliente paga desde su app bancaria.
   └─ Cliente confirma "Ya pagué" (opcional: sube comprobante)
   └─ Pedido se crea con estado 'pendiente_verificacion'

8. Confirmación en pantalla
   └─ "Tu pedido #CPS-2026-0001 fue recibido. Te confirmaremos el pago
       por WhatsApp en breve." + botón para escribir por WhatsApp.
```

---

## 5. VALIDACIÓN DE CALIDAD DE IMAGEN (requisito explícito del cliente)

Cuando el cliente sube su propia imagen, validar **en el navegador antes de subir**:

```javascript
// Reglas de validación (ajustables)
const VALIDACION = {
  minWidth: 1500,        // px — mínimo para impresión decente
  minHeight: 1500,       // px
  maxFileSizeMB: 25,
  formatosPermitidos: ['image/png', 'image/jpeg', 'image/webp'],
  recomendado: 2000      // px — sobre esto, "calidad óptima"
};
```

Lógica:
- Leer dimensiones reales del archivo (crear `Image()` y leer `naturalWidth/Height`).
- Si ancho o alto < `minWidth/minHeight` → **bloquear** con mensaje:
  *"La imagen tiene baja resolución (XXX×YYY px). Para una impresión de calidad necesitamos mínimo 1500×1500 px. Probá con una imagen más grande o nítida."*
- Si pasa el mínimo pero está bajo el recomendado → **permitir con advertencia amarilla**:
  *"La imagen funciona, pero para mejor calidad recomendamos 2000 px o más."*
- Si está sobre el recomendado → **check verde**: *"Calidad óptima ✓"*
- Validar también formato y peso.

> Nota técnica: la validación de DPI real no es fiable desde el navegador (los metadatos EXIF de DPI no son confiables). Por eso se valida por **dimensiones en px**, que es lo que realmente importa para impresión.

---

## 6. PAGO POR QR CON CONFIRMACIÓN MANUAL (crítico — leer con atención)

El cliente NO quiere integración con pasarela en v1. El flujo definido es:

1. Al llegar al paso de pago, la app **muestra un código QR** (el QR de cobro de la cuenta bancaria del negocio — en v1 puede ser una **imagen estática del QR** subida por las socias en el panel de config, o un QR generado con el string del banco).
2. El cliente paga desde su app bancaria escaneando ese QR.
3. El cliente toca **"Ya realicé el pago"**. Opcionalmente sube captura del comprobante (recomendado incluirlo — facilita la verificación).
4. El pedido se guarda con `payment_status = 'pendiente_verificacion'`.
5. **Se dispara notificación inmediata** a las socias (correo + WhatsApp) con todos los datos del pedido + el comprobante si lo subió.
6. Las socias **verifican manualmente** en su cuenta bancaria que el dinero entró.
7. Desde el **panel de admin**, marcan el pedido como `pagado_confirmado` (o `rechazado`).
8. Al confirmar, se puede disparar un mensaje automático al cliente (WhatsApp/email): *"¡Pago confirmado! Tu pedido entró a producción."*

> IMPORTANTE: en v1 NO hay verificación automática del pago. Todo el control de "¿pagó de verdad?" es manual por las socias. La app solo registra, notifica y permite cambiar el estado. Esto es intencional y correcto para el mercado boliviano en un MVP.

### Configuración del QR
- Panel admin debe permitir subir/actualizar la **imagen del QR** de cobro y los datos de la cuenta (banco, titular) que se muestran junto al QR como respaldo.

---

## 7. NOTIFICACIÓN A LAS SOCIAS

Al crearse un pedido, enviar **a ambas socias**:

**Correo (Resend):** asunto `🛒 Nuevo pedido #CPS-2026-0001 — [Nombre cliente]`. Cuerpo con:
- Datos del cliente (nombre, WhatsApp, email)
- Cada item: producto, variantes, cantidad, diseño (con thumbnail del **preview compuesto** y link a la imagen en alta), origen del diseño (galería/subida)
- Método de entrega (envío + dirección + zona, o retiro)
- Subtotal, envío, total
- Estado de pago (pendiente de verificación) + link al comprobante si lo subió
- Botón/enlace al panel admin para gestionar el pedido

**WhatsApp:** mensaje resumido con número de pedido, cliente, total y "revisar en panel". (Empezar con `wa.me` o Twilio si ya está disponible; el cliente ya exploró Twilio en GUARDIUM.)

---

## 8. PANEL DE ADMINISTRACIÓN (mínimo viable)

Acceso protegido (Supabase Auth, un solo rol "admin" compartido o una cuenta por socia).

Funciones v1:
- **Lista de pedidos** con filtros por estado de pago y estado de pedido
- **Detalle de pedido**: ver todo + descargar imágenes en alta para producir
- **Cambiar estado de pago**: pendiente → confirmado / rechazado
- **Cambiar estado de pedido**: nuevo → en producción → listo → entregado
- **Gestión de catálogo**: alta/baja de productos, precios, variantes
- **Gestión de galería de diseños**: subir/desactivar diseños
- **Gestión de zonas de envío**: editar costos por zona
- **Config**: imagen del QR de cobro, datos bancarios, correos/WhatsApp de notificación

---

## 9. COMPOSICIÓN DEL PREVIEW (detalle técnico clave)

El preview NO es un editor. Es composición automática:

```
mockup del producto (foto base, PNG)
        +
diseño (PNG/imagen) escalado y posicionado dentro de la
"print_area" definida por producto (print_area_x/y/w/h)
        =
imagen final compuesta que se muestra al cliente y se
guarda como preview_image_url
```

Implementación recomendada:
- Usar **Canvas API** en el cliente: dibujar el mockup, luego dibujar el diseño ajustado (object-fit: contain) dentro del rectángulo de print_area. Exportar a PNG/JPEG.
- Subir el preview resultante a Supabase Storage y guardar la URL en el order_item.
- El diseño se ajusta automáticamente al área (centrado, manteniendo proporción). Si no llena toda el área, se centra. Nada de input del usuario sobre posición.

> Cada producto define su propia print_area, por eso una gorra, una taza y una polera tienen zonas distintas. Esto se configura una vez por producto en el panel admin.

---

## 10. ORDEN DE CONSTRUCCIÓN RECOMENDADO (para Claude Code)

Construir y probar en este orden, no todo a la vez:

1. **Setup**: Next.js + Supabase + Tailwind + deploy vacío en Vercel funcionando.
2. **Modelo de datos**: crear todas las tablas en Supabase + seed con 2-3 productos y 5-6 diseños de prueba.
3. **Catálogo**: listar categorías y productos, página de producto con variantes. (Sin diseño aún.)
4. **Galería + selección de diseño** + **subida con validación de calidad** (sección 5).
5. **Preview compuesto** (sección 9). Este es el corazón visual — probarlo bien.
6. **Carrito** (estado en cliente, sin persistir aún).
7. **Checkout**: datos + envío/retiro + cálculo de zona + resumen.
8. **Pago QR + creación de pedido** con estado pendiente (sección 6).
9. **Notificaciones** correo + WhatsApp (sección 7).
10. **Panel admin** (sección 8).
11. **Pulido mobile + estados de carga + manejo de errores.**

> Entregar un MVP navegable tras el paso 8 para que las socias lo prueben con un pedido real de prueba ANTES de pulir el admin.

---

## 11. CONSIDERACIONES DE NEGOCIO / RIESGOS TÉCNICOS

- **WhatsApp Business API formal** requiere aprobación y número dedicado. Si demora, arrancar con `wa.me` (click-to-chat) que es inmediato y gratis. Migrar después.
- **Confirmación de pago manual** es el cuello de botella operativo: definir con las socias un tiempo de respuesta (ej. "confirmamos en menos de 2 horas en horario laboral").
- **Cobertura nacional**: validar que las zonas de envío cubran los 9 departamentos. Definir tarifas reales con las socias antes de lanzar.
- **Calidad de imágenes subidas**: aunque se valide resolución, advertir en términos y condiciones que el cliente es responsable de tener derechos sobre la imagen que sube.
- **Capacidad de producción**: la app puede generar más pedidos de los que el taller produce. Considerar (v2) un campo de "tiempo estimado de entrega" visible y/o pausar productos.

---

## 12. PENDIENTES A DEFINIR CON EL CLIENTE ANTES DE CODEAR

- [ ] Nombre y logo definitivos del negocio (tentativo: Camba Print Studio)
- [ ] Catálogo inicial real: ¿qué productos exactos y a qué precios?
- [ ] Tabla de zonas de envío con costos reales por departamento
- [ ] Datos bancarios + imagen del QR de cobro
- [ ] Correos y WhatsApp de las dos socias para notificaciones
- [ ] Set inicial de diseños para la galería (categorías y archivos PNG en alta)
- [ ] Fotos/mockups base de cada producto en blanco para el preview
```
