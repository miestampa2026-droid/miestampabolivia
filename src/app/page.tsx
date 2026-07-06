import Link from 'next/link'
import Image from 'next/image'
import { Shirt, Upload, Truck, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { ProductMockup, type MockupType } from '@/components/product/ProductMockup'
import { ProductCard } from '@/components/catalog/ProductCard'
import { getCategoriesWithProducts, getProductSizes } from '@/lib/queries/catalog'
import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer, getFavoriteProductIds } from '@/lib/queries/customers'

const HERO_BASE =
  'https://ywykaivywtvcucedxnoc.supabase.co/storage/v1/object/public/fotosia'

// Mosaico estilo Converse: hero-1 y hero-5 son pilares altos a los
// costados (ocupan las 3 filas), hero-2/3/4 se apilan en la columna
// del medio. El spec original pedía que hero-3 cruzara col2-3, pero
// eso se pisa con el pilar de hero-5 (mismas filas) — esta versión
// logra el mismo efecto visual (2 fotos altas + 3 apiladas al medio)
// sin huecos ni superposiciones.
const HERO_IMAGES = [
  { src: `${HERO_BASE}/hero-1.png`, className: 'md:col-start-1 md:row-start-1 md:row-span-3' },
  { src: `${HERO_BASE}/hero-2.png`, className: 'md:col-start-2 md:row-start-1' },
  { src: `${HERO_BASE}/hero-3.png`, className: 'md:col-start-2 md:row-start-2' },
  { src: `${HERO_BASE}/hero-4.png`, className: 'md:col-start-2 md:row-start-3' },
  { src: `${HERO_BASE}/hero-5.png`, className: 'md:col-start-3 md:row-start-1 md:row-span-3' }
]

export const revalidate = 0

const CATEGORIAS: {
  slug: string
  name: string
  bg: string
  mockupType: MockupType
  mockupColor: string
}[] = [
  { slug: 'poleras', name: 'Poleras', bg: 'bg-coral-light', mockupType: 'polera', mockupColor: 'coral' },
  { slug: 'blusas-mujer', name: 'Blusas Mujer', bg: 'bg-[#F3E8FF]', mockupType: 'blusa', mockupColor: 'violeta' },
  { slug: 'gorras', name: 'Gorras', bg: 'bg-[#DCFCE7]', mockupType: 'gorra', mockupColor: 'verde' },
  { slug: 'tazas', name: 'Tazas', bg: 'bg-[#DBEAFE]', mockupType: 'taza', mockupColor: 'azul' },
  { slug: 'sueteres', name: 'Suéteres', bg: 'bg-[#FEF3C7]', mockupType: 'sueter', mockupColor: 'amarillo' },
  { slug: 'tote-bags', name: 'Tote Bags', bg: 'bg-gray-light', mockupType: 'totebag', mockupColor: 'gris' }
]

const MARQUEE_ITEMS = [
  'Tu estilo, tu estampa',
  'Poleras',
  'Gorras',
  'Tazas',
  'Suéteres',
  'Envío a Bolivia',
  'miestampa.com'
]

const PASOS = [
  { title: 'Elegís tu prenda', icon: Shirt },
  { title: 'Subís tu diseño', icon: Upload },
  { title: 'Recibís en casa', icon: Truck }
]

export default async function Home() {
  const { products } = await getCategoriesWithProducts()
  // Primero los que tienen badge "Más vendido", completando con el resto
  // (el orden de la query ahora es created_at DESC).
  const featured = products.filter((p) => p.badge === 'Más vendido')
  const bestsellers = [...featured, ...products.filter((p) => p.badge !== 'Más vendido')].slice(0, 4)
  const sizesByProduct = await getProductSizes(bestsellers.map((p) => p.id))

  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  const favoriteProductIds = customer ? await getFavoriteProductIds(supabase, customer.id) : undefined

  const countByCategoryName: Record<string, number> = {}
  for (const p of products) {
    countByCategoryName[p.category_name] = (countByCategoryName[p.category_name] ?? 0) + 1
  }
  const categoriasConStock = Object.values(countByCategoryName).filter((c) => c > 0).length

  return (
    <main className="bg-white">
      {/* Sección 1 — Hero: mosaico de fotos reales estilo Converse */}
      <section
        className="md:grid md:grid-cols-[2fr_3fr]"
        style={{ background: 'linear-gradient(160deg, #ffffff 60%, #FDE8E7 100%)' }}
      >
        {/* Columna texto — 40% en desktop */}
        <div className="flex flex-col justify-center px-6 py-16 text-center md:px-12 md:py-20 md:text-left lg:px-16">
          <span className="mb-6 inline-block font-display text-sm font-bold uppercase tracking-[0.2em] text-coral">
            Nueva forma de personalizar
          </span>

          <h1 className="font-display text-charcoal leading-[1.05] text-[clamp(48px,6vw,88px)]">
            <span className="font-normal">Mi </span>
            <span className="font-extrabold text-coral">Estampa</span>
          </h1>

          <p className="mx-auto mt-6 max-w-md font-body text-lg text-gray-mid md:mx-0">
            La primera plataforma de Bolivia donde personalizás tu ropa. Elegí la prenda, subí tu
            diseño y nosotros lo estampamos.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link
              href="/catalogo"
              className="w-full rounded-full bg-coral px-7 py-3.5 text-center font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md sm:w-auto"
            >
              Ver catálogo
            </Link>
            <a
              href="#explora"
              className="w-full rounded-full border-2 border-coral px-7 py-3.5 text-center font-display text-[15px] font-bold text-coral transition hover:bg-coral hover:text-white sm:w-auto"
            >
              ¿Cómo funciona?
            </a>
          </div>

          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-2 font-body text-sm text-gray-mid md:justify-start">
            <span>{categoriasConStock} categorías</span>
            <span className="text-coral">·</span>
            <span>Envío a Bolivia</span>
            <span className="text-coral">·</span>
            <span>Pago por QR</span>
          </p>
        </div>

        {/* Columna mosaico — 60% en desktop, ~90vh, sin huecos */}
        <div className="grid grid-cols-2 gap-3 p-3 md:grid-cols-3 md:grid-rows-3 md:gap-3 md:p-4 md:h-[90vh]">
          {HERO_IMAGES.map(({ src, className }, i) => (
            <div
              key={src}
              className={`group relative overflow-hidden rounded-2xl ${className} ${
                i === 0 ? 'col-span-2 aspect-[2/1] md:aspect-auto' : 'aspect-square md:aspect-auto'
              }`}
            >
              <Image
                src={src}
                alt="Prenda personalizada Mi Estampa"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 30vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Sección 2 — Banner promocional, 2 columnas 50/50 */}
      <section id="explora" className="grid sm:grid-cols-2">
        <div className="bg-coral px-6 py-16 text-center sm:px-12 sm:py-20 sm:text-left">
          <span className="mb-4 inline-block font-display text-sm font-bold uppercase tracking-[0.2em] text-white/80">
            Nuevo en Bolivia
          </span>
          <h2 className="font-display text-[clamp(28px,4vw,36px)] font-bold leading-tight text-white">
            Personalización 100% online
          </h2>
          <p className="mx-auto mt-4 max-w-sm font-body text-base leading-relaxed text-white/90 sm:mx-0">
            Sin llamadas, sin visitas. Diseñás, pagás y recibís en tu puerta.
          </p>
          <Link
            href="/catalogo"
            className="mt-6 inline-block rounded-full bg-white px-7 py-3.5 font-display text-[15px] font-bold text-coral shadow-card-sm transition hover:-translate-y-px hover:shadow-card-md"
          >
            Empezar ahora →
          </Link>
        </div>

        <div className="bg-coral-light px-6 py-16 sm:px-12 sm:py-20">
          <div className="mx-auto flex max-w-sm flex-col gap-8">
            {PASOS.map(({ title, icon: Icon }, i) => (
              <div key={title} className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white font-display text-lg font-extrabold text-coral">
                  {i + 1}
                </span>
                <div className="flex items-center gap-2">
                  <Icon size={20} className="shrink-0 text-coral" aria-hidden />
                  <p className="font-display text-base font-bold text-charcoal">{title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección 3 — Categorías */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center font-display text-[clamp(28px,4vw,40px)] font-bold text-charcoal">
            Explorar por categoría
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
            {CATEGORIAS.map((cat) => {
              const count = countByCategoryName[cat.name] ?? 0
              return (
                <Link
                  key={cat.slug}
                  href={`/catalogo?categoria=${cat.slug}`}
                  className={`group relative aspect-[4/3] overflow-hidden rounded-2xl ${cat.bg} p-6 shadow-card-sm transition duration-200 ease-brand hover:-translate-y-1 hover:scale-[1.03] hover:shadow-card-lg`}
                >
                  {count > 0 && (
                    <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 font-display text-sm font-bold text-coral-dark">
                      {count} {count === 1 ? 'producto' : 'productos'}
                    </span>
                  )}

                  <div className="flex h-full flex-col items-center justify-center">
                    <div className="w-full max-w-[160px]">
                      <ProductMockup type={cat.mockupType} color={cat.mockupColor} className="h-full w-full" />
                    </div>
                    <p className="mt-3 font-display text-base font-bold text-charcoal">{cat.name}</p>
                  </div>

                  <ArrowRight
                    size={18}
                    className="absolute bottom-3 right-3 text-coral opacity-0 transition duration-200 ease-brand group-hover:opacity-100"
                    aria-hidden
                  />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden bg-coral py-3">
        <div className="flex w-max animate-marquee gap-6 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex items-center gap-6 pr-6">
              {MARQUEE_ITEMS.map((item, i) => (
                <span
                  key={`${copy}-${i}`}
                  className="flex items-center gap-6 font-display text-sm font-bold uppercase tracking-wider text-white"
                >
                  {item}
                  <span aria-hidden>·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Sección 4 — Más vendidos */}
      {bestsellers.length > 0 && (
        <section className="px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-coral">
                Catálogo
              </span>
              <h2 className="mt-2 font-display text-[clamp(28px,4vw,40px)] font-bold text-charcoal">
                Más vendidos
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {bestsellers.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showTechnique
                  sizes={sizesByProduct[product.id]}
                  isLoggedIn={!!customer}
                  initialFavorited={favoriteProductIds?.has(product.id)}
                />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/catalogo"
                className="inline-block rounded-full bg-coral px-7 py-3.5 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md"
              >
                Ver todo el catálogo
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-charcoal px-6 py-12 text-center">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Logo variant="filled" size={28} />
            <span className="font-display text-lg">
              <span className="font-normal text-white">Mi </span>
              <span className="font-extrabold text-white">Estampa</span>
            </span>
          </Link>
          <p className="font-body text-sm text-white/60">Tu estilo, tu estampa</p>
          <p className="font-body text-sm text-white/40">© 2026 Mi Estampa · miestampa.com</p>
        </div>
      </footer>
    </main>
  )
}
