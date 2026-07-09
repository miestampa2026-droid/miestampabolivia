'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/admin/pedidos', label: 'Pedidos' },
  { href: '/admin/categorias', label: 'Categorías' },
  { href: '/admin/configuracion', label: 'Configuración' }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-dvh bg-off-white">
      <div className="container py-8 sm:py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.1em] text-coral">
              Panel Mi Estampa
            </p>
            <h1 className="font-display text-[clamp(24px,4vw,36px)] font-bold leading-tight text-charcoal">
              Administración
            </h1>
          </div>
          <Link
            href="/"
            className="font-display text-sm font-bold text-charcoal transition hover:text-coral"
          >
            ← Volver a la tienda
          </Link>
        </div>

        <nav className="mb-8 flex gap-2">
          {TABS.map((tab) => {
            const active = pathname.startsWith(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'rounded-full px-5 py-2.5 font-display text-sm font-bold transition',
                  active ? 'bg-coral text-white' : 'bg-white text-charcoal shadow-card-sm hover:bg-gray-light'
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>

        {children}
      </div>
    </div>
  )
}
