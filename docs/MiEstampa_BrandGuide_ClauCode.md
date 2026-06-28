# MI ESTAMPA — Guía de Identidad Visual y Design System
## Para Claude Code · MVP v1 · Junio 2026

---

## 1. IDENTIDAD DE MARCA

| Atributo | Definición |
|----------|-----------|
| **Nombre** | Mi Estampa |
| **Dominio** | miestampa.com |
| **Eslogan** | Tu estilo, tu estampa |
| **Personalidad** | Cercana · Creativa · Confiable · Simple |
| **Tono de voz** | Directo y amigable. Habla de "tú". Sin tecnicismos. |
| **Audiencia** | Personas y empresas en Bolivia que quieren personalizar prendas y accesorios. Mercado principalmente femenino y corporativo. |
| **Diferenciador** | Primera plataforma web en Bolivia donde puedes elegir, personalizar y pedir todo online sin llamar ni ir a un local. |

---

## 2. PALETA DE COLORES OFICIAL

```css
:root {
  /* ── PRIMARIOS ── */
  --color-coral:        #F05A4F;   /* Coral principal — botones, íconos, logo */
  --color-coral-dark:   #D44840;   /* Coral oscuro — hover de botones */
  --color-coral-light:  #FDE8E7;   /* Coral muy suave — backgrounds de secciones */

  /* ── NEUTROS ── */
  --color-charcoal:     #2B2B2B;   /* Casi negro — textos principales, wordmark */
  --color-gray-mid:     #6B7280;   /* Gris medio — textos secundarios, placeholders */
  --color-gray-light:   #F3F4F6;   /* Gris muy claro — fondos alternos */
  --color-white:        #FFFFFF;   /* Blanco puro — fondo base */
  --color-off-white:    #FAFAFA;   /* Blanco cálido — fondo suave */

  /* ── ESTADO / FEEDBACK ── */
  --color-success:      #22C55E;   /* Verde — pago confirmado, validación OK */
  --color-warning:      #F59E0B;   /* Ámbar — advertencia calidad imagen */
  --color-error:        #EF4444;   /* Rojo — error, bloqueo calidad imagen */
  --color-info:         #3B82F6;   /* Azul — información neutral */
}
```

### Uso de colores por elemento

| Elemento | Color |
|----------|-------|
| Botón principal (CTA) | `--color-coral` con texto blanco |
| Hover botón principal | `--color-coral-dark` |
| Botón secundario | Borde `--color-coral`, texto `--color-coral`, fondo transparente |
| Fondo de página | `--color-white` o `--color-off-white` |
| Secciones alternas | `--color-gray-light` o `--color-coral-light` |
| Texto principal | `--color-charcoal` |
| Texto secundario | `--color-gray-mid` |
| Links | `--color-coral` |
| Logo / ícono | `--color-coral` + `--color-charcoal` |
| Badge / etiqueta destacada | `--color-coral-light` con texto `--color-coral-dark` |

### Combinaciones prohibidas
- ❌ Coral sobre coral
- ❌ Texto gris claro sobre blanco (contraste insuficiente)
- ❌ Agregar colores nuevos sin necesidad — la paleta es suficiente

---

## 3. TIPOGRAFÍA

```css
/* Google Fonts — incluir en <head> */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Nunito:wght@300;400;600;700&display=swap');

:root {
  --font-display: 'Plus Jakarta Sans', sans-serif;  /* Títulos, wordmark, botones */
  --font-body:    'Nunito', sans-serif;              /* Cuerpo de texto, labels, UI */
}
```

> **Decisión de diseño:** Plus Jakarta Sans es moderna, redondeada y transmite confianza y frescura — acorde a la personalidad de la marca. Nunito como body complementa con suavidad y buena legibilidad en mobile.

### Escala tipográfica

```css
/* Título hero / display */
.text-display {
  font-family: var(--font-display);
  font-size: clamp(40px, 7vw, 80px);
  font-weight: 800;
  line-height: 1.05;
  color: var(--color-charcoal);
}

/* Títulos de sección (h2) */
.text-heading {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-charcoal);
}

/* Subtítulos (h3) */
.text-subheading {
  font-family: var(--font-display);
  font-size: clamp(18px, 2vw, 24px);
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-charcoal);
}

/* Cuerpo */
.text-body {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.75;
  color: var(--color-charcoal);
}

/* Texto secundario / descriptivo */
.text-secondary {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-gray-mid);
}

/* Labels / eyebrow (texto pequeño arriba de títulos) */
.text-label {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-coral);
}

/* Precio */
.text-price {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 800;
  color: var(--color-charcoal);
}

/* Precio con Bs. antes */
/* Ejemplo: Bs. 120 */
```

### Wordmark (logo tipográfico)
```
"Mi Estampa"
→ "Mi " → Plus Jakarta Sans 400 (regular), color charcoal
→ "Estampa" → Plus Jakarta Sans 800 (extrabold), color charcoal
→ Eslogan "Tu estilo, tu estampa" → Nunito 400, 14px, color gray-mid
```

---

## 4. ESPACIADO Y LAYOUT

```css
:root {
  --space-xs:   8px;
  --space-sm:   16px;
  --space-md:   24px;
  --space-lg:   40px;
  --space-xl:   64px;
  --space-2xl:  96px;

  --radius-sm:  8px;
  --radius-md:  12px;
  --radius-lg:  20px;
  --radius-full: 999px;  /* Botones píldora */

  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.10);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.12);

  --transition: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 5. COMPONENTES UI — ESTILOS DEFINIDOS

### Botones

```css
/* Botón primario */
.btn-primary {
  background: var(--color-coral);
  color: white;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  padding: 14px 28px;
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  transition: background var(--transition), transform var(--transition), box-shadow var(--transition);
}
.btn-primary:hover {
  background: var(--color-coral-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Botón secundario (outline) */
.btn-secondary {
  background: transparent;
  color: var(--color-coral);
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  padding: 13px 27px;
  border-radius: var(--radius-full);
  border: 2px solid var(--color-coral);
  cursor: pointer;
  transition: all var(--transition);
}
.btn-secondary:hover {
  background: var(--color-coral);
  color: white;
}

/* Botón desactivado */
.btn-disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}
```

### Cards de Producto

```css
.product-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: transform var(--transition), box-shadow var(--transition);
  cursor: pointer;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.product-card__image {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  background: var(--color-gray-light);
}
.product-card__body {
  padding: var(--space-md);
}
.product-card__name {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--color-charcoal);
  margin-bottom: 4px;
}
.product-card__price {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 800;
  color: var(--color-coral);
}
```

### Badges de estado de pedido

```css
/* Usar con texto descriptivo del estado */
.badge { padding: 4px 12px; border-radius: var(--radius-full); font-size: 12px; font-weight: 700; font-family: var(--font-display); }
.badge--pending  { background: #FEF3C7; color: #D97706; } /* Pendiente de verificación */
.badge--paid     { background: #DCFCE7; color: #16A34A; } /* Pago confirmado          */
.badge--rejected { background: #FEE2E2; color: #DC2626; } /* Rechazado                */
.badge--production { background: #DBEAFE; color: #1D4ED8; } /* En producción           */
.badge--ready    { background: #F3E8FF; color: #7C3AED; } /* Listo para entrega       */
.badge--delivered { background: #F0FDF4; color: #15803D; } /* Entregado               */
```

### Validación de imagen (indicadores de calidad)

```css
/* Calidad insuficiente — bloquear */
.quality-bad {
  background: #FEE2E2;
  border: 1.5px solid var(--color-error);
  color: var(--color-error);
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-md);
  font-size: 14px;
  font-family: var(--font-body);
}

/* Calidad aceptable — advertencia */
.quality-warn {
  background: #FFFBEB;
  border: 1.5px solid var(--color-warning);
  color: #92400E;
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-md);
  font-size: 14px;
  font-family: var(--font-body);
}

/* Calidad óptima */
.quality-ok {
  background: #F0FDF4;
  border: 1.5px solid var(--color-success);
  color: #15803D;
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-md);
  font-size: 14px;
  font-family: var(--font-body);
}
```

### Inputs / Formularios

```css
.input {
  width: 100%;
  font-family: var(--font-body);
  font-size: 15px;
  padding: 12px 16px;
  border: 1.5px solid #E5E7EB;
  border-radius: var(--radius-md);
  background: var(--color-white);
  color: var(--color-charcoal);
  transition: border-color var(--transition), box-shadow var(--transition);
  outline: none;
}
.input:focus {
  border-color: var(--color-coral);
  box-shadow: 0 0 0 3px rgba(240, 90, 79, 0.12);
}
.input::placeholder {
  color: var(--color-gray-mid);
}
.input-label {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-charcoal);
  margin-bottom: 6px;
  display: block;
}
```

---

## 6. ICONOGRAFÍA

Usar **Lucide Icons** (ya disponible en Next.js/React como `lucide-react`). Es limpio, minimalista y coherente con la estética de la marca.

```bash
npm install lucide-react
```

```jsx
import { ShoppingCart, Heart, Upload, CheckCircle, Package, Star } from 'lucide-react'
```

Tamaño estándar: `size={20}` para UI, `size={24}` para acciones prominentes. Color: heredar del contexto o usar `--color-coral` para íconos de acción.

---

## 7. DISEÑO DE LA NAVEGACIÓN

```
NAV (fijo en la parte superior):
─────────────────────────────────────────────────────────
[Logo: ícono + "Mi Estampa"]    Catálogo  Cómo funciona    [🛒 Carrito (N)]
─────────────────────────────────────────────────────────
```

- Fondo: `rgba(255,255,255,0.92)` con `backdrop-filter: blur(20px)`
- Borde inferior aparece al hacer scroll: `1px solid var(--color-gray-light)`
- El carrito muestra badge rojo con la cantidad de items
- En mobile: menú hamburguesa, carrito siempre visible

---

## 8. DISEÑO DEL FLUJO PRINCIPAL (pantallas clave)

### Paso 1 — Catálogo
- Grid de 2 columnas en mobile, 3–4 en desktop
- Cards con imagen cuadrada 1:1, nombre y precio
- Filtro por categoría: chips/tabs horizontales en la parte superior
- Fondo: `--color-off-white`

### Paso 2 — Página de Producto
- Imagen grande del producto (mockup base)
- Selector de variantes (talla, color) como chips seleccionables
- Botón "Elegir diseño" coral grande — CTA principal

### Paso 3 — Elegir Diseño
- Tabs: "Galería" / "Subir mi imagen"
- Galería: grid de diseños con categorías, seleccionable
- Subir imagen: drop zone con indicador de calidad (sección 5 de la spec)

### Paso 4 — Preview
- Imagen compuesta centrada y grande (mockup + diseño)
- Mensaje: "¿Así querés tu estampa?"
- Dos botones: "Cambiar diseño" (secundario) / "Agregar al carrito" (primario)

### Paso 5 — Carrito
- Lista de items con thumbnail del preview
- Resumen de precios
- Botón "Ir a pagar" coral

### Paso 6 — Checkout
- Formulario limpio: nombre, WhatsApp, email
- Toggle: "Envío a domicilio" / "Retiro en local"
- Si envío: selector de zona + precio calculado automático
- Resumen final antes de confirmar

### Paso 7 — Pago QR
- QR grande y centrado
- Datos bancarios debajo (banco + titular)
- Botón "Ya realicé el pago" + opción de subir comprobante
- Fondo: `--color-coral-light` suave para dar sensación de "último paso"

### Paso 8 — Confirmación
- Ícono de check grande en coral
- "¡Pedido recibido! 🎉"
- Número de pedido visible
- "Te confirmamos el pago por WhatsApp en breve"
- Botón de WhatsApp para escribir directamente

---

## 9. VARIABLES CSS COMPLETAS — PEGAR EN globals.css

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Nunito:wght@300;400;600;700&display=swap');

:root {
  /* Colores */
  --color-coral:        #F05A4F;
  --color-coral-dark:   #D44840;
  --color-coral-light:  #FDE8E7;
  --color-charcoal:     #2B2B2B;
  --color-gray-mid:     #6B7280;
  --color-gray-light:   #F3F4F6;
  --color-white:        #FFFFFF;
  --color-off-white:    #FAFAFA;
  --color-success:      #22C55E;
  --color-warning:      #F59E0B;
  --color-error:        #EF4444;
  --color-info:         #3B82F6;

  /* Tipografía */
  --font-display: 'Plus Jakarta Sans', sans-serif;
  --font-body:    'Nunito', sans-serif;

  /* Espaciado */
  --space-xs:   8px;
  --space-sm:   16px;
  --space-md:   24px;
  --space-lg:   40px;
  --space-xl:   64px;
  --space-2xl:  96px;

  /* Bordes */
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   20px;
  --radius-full: 999px;

  /* Sombras */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.10);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.12);

  /* Transición */
  --transition: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Reset mínimo */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
img { max-width: 100%; display: block; }
body {
  font-family: var(--font-body);
  color: var(--color-charcoal);
  background: var(--color-white);
  -webkit-font-smoothing: antialiased;
}
```

---

## 10. TAILWIND CONFIG (si se usa Tailwind en vez de CSS puro)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: '#F05A4F',
          dark:    '#D44840',
          light:   '#FDE8E7',
        },
        charcoal: '#2B2B2B',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'xl':  '20px',
        'full': '999px',
      },
    }
  }
}
```

### Clases Tailwind frecuentes en este proyecto
```
Botón primario:   bg-coral text-white font-bold rounded-full px-7 py-3 hover:bg-coral-dark transition
Botón secundario: border-2 border-coral text-coral font-bold rounded-full px-7 py-3 hover:bg-coral hover:text-white transition
Card producto:    bg-white rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-lg transition cursor-pointer
Precio:           font-display text-xl font-extrabold text-coral
Label/eyebrow:    text-coral text-xs font-bold uppercase tracking-widest
```

---

## 11. CHECKLIST PARA CLAU CODE

Antes de entregar cualquier pantalla, verificar:

- [ ] ¿Se usaron `--color-coral` y `--color-charcoal` y no colores hardcodeados?
- [ ] ¿Tipografía Plus Jakarta Sans en títulos y botones?
- [ ] ¿Botones con `border-radius: full` (píldora)?
- [ ] ¿Cards con hover `translateY(-4px)` y sombra?
- [ ] ¿Mobile-first? (probar en 375px primero)
- [ ] ¿Inputs con focus ring coral?
- [ ] ¿Todos los estados de loading/error/success cubiertos con los colores de feedback?
- [ ] ¿El logo aparece en la nav correctamente?
- [ ] ¿El eslogan "Tu estilo, tu estampa" aparece donde corresponde?
```
