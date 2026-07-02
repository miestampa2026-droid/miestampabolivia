import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { ProductMockup, type MockupType } from '@/components/product/ProductMockup'
import { ProductCard } from '@/components/catalog/ProductCard'
import { getCategoriesWithProducts } from '@/lib/queries/catalog'

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

export default async function Home() {
  const { products } = await getCategoriesWithProducts()
  const bestsellers = products.slice(0, 4)

  return (
    <main className="bg-white">
      {/* Sección 1 — Hero */}
      <section
        className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-24 text-center"
        style={{ background: 'linear-gradient(160deg, #ffffff 60%, #FDE8E7 100%)' }}
      >
        <div className="w-full max-w-lg">
          <span
            className="mb-6 inline-block animate-fadeUp font-display text-sm font-bold uppercase tracking-[0.2em] text-coral"
            style={{ animationDelay: '0ms' }}
          >
            Nueva forma de personalizar
          </span>

          <h1
            className="animate-fadeUp font-display text-charcoal leading-[1.05] text-[clamp(56px,9vw,100px)]"
            style={{ animationDelay: '100ms' }}
          >
            <span className="font-normal">Mi </span>
            <span className="font-extrabold text-coral">Estampa</span>
          </h1>

          <p
            className="mt-3 animate-fadeUp font-body text-xl text-gray-mid"
            style={{ animationDelay: '200ms' }}
          >
            Tu estilo, tu estampa
          </p>

          <div
            className="mt-10 flex animate-fadeUp flex-col items-center gap-3 sm:flex-row sm:justify-center"
            style={{ animationDelay: '300ms' }}
          >
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
        </div>

        <a
          href="#explora"
          aria-label="Descubrir más"
          className="mt-16 flex animate-fadeUp flex-col items-center gap-1 font-body text-sm text-gray-mid transition hover:text-coral"
          style={{ animationDelay: '400ms' }}
        >
          <ChevronDown size={22} className="animate-bounce" aria-hidden />
        </a>
      </section>

      {/* Sección 2 — Banner promocional */}
      <section id="explora" className="bg-coral-light px-6 py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <h2 className="font-display text-[clamp(28px,4vw,36px)] font-extrabold leading-tight text-charcoal">
              Estampá tus momentos
            </h2>
            <p className="mx-auto mt-3 max-w-sm font-body text-base leading-relaxed text-charcoal sm:mx-0">
              Elegí cualquier prenda, subí tu diseño y nosotros lo estampamos. Envío a todo Bolivia.
            </p>
            <Link
              href="/catalogo"
              className="mt-6 inline-block rounded-full bg-coral px-7 py-3.5 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md"
            >
              Empezar ahora →
            </Link>
          </div>

          <Logo variant="filled" size={200} className="shrink-0" />
        </div>
      </section>

      {/* Sección 3 — Categorías */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center font-display text-[clamp(28px,4vw,40px)] font-bold text-charcoal">
            Explorar por categoría
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
            {CATEGORIAS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalogo?categoria=${cat.slug}`}
                className={`group rounded-2xl ${cat.bg} p-6 text-center shadow-card-sm transition duration-200 ease-brand hover:-translate-y-1 hover:shadow-card-lg`}
              >
                <div className="mx-auto aspect-square w-full max-w-[120px]">
                  <ProductMockup type={cat.mockupType} color={cat.mockupColor} className="h-full w-full" />
                </div>
                <p className="mt-3 font-display text-sm font-bold text-charcoal">{cat.name}</p>
              </Link>
            ))}
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
                <ProductCard key={product.id} product={product} />
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
