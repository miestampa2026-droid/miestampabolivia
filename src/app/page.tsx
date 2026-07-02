import Link from 'next/link'
import { Shirt, Upload, Truck, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { ProductMockup, type MockupType } from '@/components/product/ProductMockup'
import { ProductCard } from '@/components/catalog/ProductCard'
import { getCategoriesWithProducts, getProductSizes } from '@/lib/queries/catalog'

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

const FAN_CARDS: { type: MockupType; offset: number; rotate: number; z: number }[] = [
  { type: 'polera', offset: -120, rotate: -6, z: 0 },
  { type: 'gorra', offset: 0, rotate: 0, z: 10 },
  { type: 'taza', offset: 120, rotate: 6, z: 0 }
]

export default async function Home() {
  const { products } = await getCategoriesWithProducts()
  const featured = products.filter((p) => p.badge === 'Más vendido')
  const bestsellers = (featured.length >= 4 ? featured : products).slice(0, 4)
  const sizesByProduct = await getProductSizes(bestsellers.map((p) => p.id))

  const countByCategoryName: Record<string, number> = {}
  for (const p of products) {
    countByCategoryName[p.category_name] = (countByCategoryName[p.category_name] ?? 0) + 1
  }
  const categoriasConStock = Object.values(countByCategoryName).filter((c) => c > 0).length

  return (
    <main className="bg-white">
      {/* Sección 1 — Hero. min-h descuenta los 64px (h-16) de la nav
          sticky para que el contenido quede centrado en el viewport
          visible, no en 100dvh completo. */}
      <section
        className="flex min-h-[calc(100dvh-4rem)] items-center px-6 py-16"
        style={{ background: 'linear-gradient(160deg, #ffffff 60%, #FDE8E7 100%)' }}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="w-full max-w-xl animate-fadeUp text-center lg:text-left">
            <span className="mb-6 inline-block font-display text-sm font-bold uppercase tracking-[0.2em] text-coral">
              Nueva forma de personalizar
            </span>

            <h1 className="font-display text-charcoal leading-[1.02] text-[clamp(64px,9vw,110px)]">
              <span className="block font-light">Mi</span>
              <span className="block font-black text-coral">Estampa</span>
            </h1>

            <p className="mx-auto mt-6 max-w-[440px] font-body text-lg text-gray-mid lg:mx-0">
              La primera plataforma de Bolivia donde personalizás tu ropa online. Elegís la
              prenda, subís tu diseño y nosotros lo estampamos.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
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

            <p className="mt-6 flex flex-wrap items-center justify-center gap-x-2 font-body text-sm text-gray-mid lg:justify-start">
              <span>{categoriasConStock} categorías</span>
              <span className="text-coral">·</span>
              <span>Envío a Bolivia</span>
              <span className="text-coral">·</span>
              <span>Pago por QR</span>
            </p>
          </div>

          {/* Mobile: fila horizontal scrolleable */}
          <div className="flex w-full gap-4 overflow-x-auto px-1 pb-2 lg:hidden">
            {FAN_CARDS.map(({ type }) => (
              <div
                key={type}
                className="h-[160px] w-[140px] shrink-0 rounded-2xl bg-white p-5 shadow-card-md"
              >
                <ProductMockup type={type} color="coral" className="h-full w-full" />
              </div>
            ))}
          </div>

          {/* Desktop: stack en abanico */}
          <div className="relative hidden h-[300px] w-[380px] shrink-0 lg:block">
            {FAN_CARDS.map(({ type, offset, rotate, z }) => (
              <div
                key={type}
                className="absolute left-1/2 top-1/2 flex h-56 w-48 items-center justify-center rounded-2xl bg-white shadow-card-lg"
                style={{
                  zIndex: z,
                  transform: `translate(calc(-50% + ${offset}px), -50%) rotate(${rotate}deg)`
                }}
              >
                <ProductMockup type={type} color="coral" className="h-24 w-24" />
              </div>
            ))}
          </div>
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
