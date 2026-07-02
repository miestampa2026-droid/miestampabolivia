import Link from 'next/link'
import { ChevronDown, Shirt, Palette, Truck } from 'lucide-react'

const PASOS = [
  {
    icon: Shirt,
    title: 'Elegí tu producto',
    text: 'Poleras, gorras, tazas y más. Vos elegís talla, color y tipo.'
  },
  {
    icon: Palette,
    title: 'Elegí tu diseño',
    text: 'De la galería o subí el tuyo. Vemos el preview al instante.'
  },
  {
    icon: Truck,
    title: 'Recibilo donde estés',
    text: 'Envío a todo Bolivia o retiro en el local. Vos elegís.'
  }
]

export default function Home() {
  return (
    <main className="bg-off-white">
      <section className="flex min-h-[100dvh] flex-col items-center justify-center bg-gradient-to-b from-white to-coral-light px-6 py-24 text-center">
        <div className="w-full max-w-lg">
          <span className="mb-6 inline-block font-display text-sm font-bold uppercase tracking-[0.2em] text-coral">
            Bolivia · Envío a todo el país
          </span>

          <h1 className="font-display text-charcoal leading-[1.05] text-[clamp(48px,12vw,80px)]">
            <span className="font-normal">Mi </span>
            <span className="font-extrabold">Estampa</span>
          </h1>

          <p className="mt-3 font-body text-lg text-gray-mid sm:text-xl">Tu estilo, tu estampa</p>

          <p className="mx-auto mt-6 max-w-sm font-body text-base leading-relaxed text-charcoal">
            Personalizá poleras, gorras y tazas con tu propio diseño. Elegís, ves el preview y lo
            recibís en tu casa.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/catalogo"
              className="w-full rounded-full bg-coral px-7 py-3.5 text-center font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md sm:w-auto"
            >
              Ver catálogo
            </Link>
            <a
              href="#como-funciona"
              className="w-full rounded-full border-2 border-coral px-7 py-3.5 text-center font-display text-[15px] font-bold text-coral transition hover:bg-coral hover:text-white sm:w-auto"
            >
              Cómo funciona
            </a>
          </div>
        </div>

        <a
          href="#como-funciona"
          aria-label="Ver cómo funciona"
          className="mt-16 flex flex-col items-center gap-1 font-body text-sm text-gray-mid transition hover:text-coral"
        >
          Descubrí más
          <ChevronDown size={20} className="animate-bounce" aria-hidden />
        </a>
      </section>

      <section id="como-funciona" className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-coral">
              Cómo funciona
            </span>
            <h2 className="mt-2 font-display text-[clamp(28px,4vw,48px)] font-bold leading-tight text-charcoal">
              Tres pasos, nada más
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {PASOS.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl bg-white p-6 text-center shadow-card-sm transition hover:-translate-y-1 hover:shadow-card-lg"
              >
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-coral-light text-coral">
                  <Icon size={24} aria-hidden />
                </span>
                <p className="font-display text-base font-bold text-charcoal">{title}</p>
                <p className="mt-2 font-body text-sm leading-relaxed text-gray-mid">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/catalogo"
              className="inline-block rounded-full bg-coral px-7 py-3.5 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md"
            >
              Empezar ahora
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-6 py-6 text-center font-body text-sm text-gray-mid">
        © {new Date().getFullYear()} Mi Estampa · Bolivia
      </footer>
    </main>
  )
}
