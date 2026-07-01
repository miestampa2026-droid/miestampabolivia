import Link from 'next/link'

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-transparent bg-white/92 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-baseline gap-1 font-display">
          <span className="font-normal text-charcoal">Mi </span>
          <span className="font-extrabold text-charcoal">Estampa</span>
        </Link>

        <Link
          href="/catalogo"
          className="font-display text-sm font-bold text-charcoal transition hover:text-coral"
        >
          Catálogo
        </Link>
      </div>
    </header>
  )
}
