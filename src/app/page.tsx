import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-dvh bg-off-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-coral-light text-coral-dark font-display text-[11px] font-bold uppercase tracking-[0.18em] mb-8">
            <Sparkles size={14} aria-hidden />
            Próximamente en Bolivia
          </span>

          <h1 className="font-display text-charcoal leading-[1.05] text-[clamp(48px,12vw,80px)] mb-2">
            <span className="font-normal">Mi </span>
            <span className="font-extrabold">Estampa</span>
          </h1>

          <p className="font-body text-gray-mid text-sm sm:text-base mb-12">
            Tu estilo, tu estampa
          </p>

          <p className="font-body text-charcoal text-base leading-relaxed max-w-sm mx-auto">
            Estamos preparando una nueva forma de personalizar tus prendas y accesorios online,
            con envío a todo el país.
          </p>

          <Link
            href="/catalogo"
            className="mt-10 inline-block rounded-full bg-coral px-7 py-3 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md"
          >
            Ver catálogo
          </Link>

          <div className="mt-10 inline-flex flex-col items-center gap-3">
            <div className="h-1 w-12 rounded-full bg-coral" />
            <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-mid">
              MVP en construcción
            </span>
          </div>
        </div>
      </div>

      <footer className="px-6 py-6 text-center font-body text-xs text-gray-mid">
        © {new Date().getFullYear()} Mi Estampa · Bolivia
      </footer>
    </main>
  )
}
