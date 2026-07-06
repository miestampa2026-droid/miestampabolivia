'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/cuenta', label: 'Resumen' },
  { href: '/cuenta/perfil', label: 'Mis datos' },
  { href: '/cuenta/direcciones', label: 'Direcciones' },
  { href: '/cuenta/favoritos', label: 'Favoritos' },
  { href: '/cuenta/pedidos', label: 'Mis pedidos' }
]

export default function CuentaDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <main className="min-h-dvh bg-off-white">
      <div className="container py-8 sm:py-12">
        <h1 className="mb-6 font-display text-[clamp(28px,4vw,40px)] font-bold leading-tight text-charcoal">
          Mi cuenta
        </h1>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:w-56 lg:shrink-0 lg:flex-col lg:overflow-visible">
            {TABS.map((tab) => {
              const active =
                tab.href === '/cuenta' ? pathname === '/cuenta' : pathname.startsWith(tab.href)
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    'shrink-0 rounded-full px-4 py-2.5 font-display text-sm font-bold transition lg:rounded-lg',
                    active
                      ? 'bg-coral text-white'
                      : 'bg-white text-charcoal shadow-card-sm hover:bg-gray-light'
                  )}
                >
                  {tab.label}
                </Link>
              )
            })}
          </nav>

          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </main>
  )
}
