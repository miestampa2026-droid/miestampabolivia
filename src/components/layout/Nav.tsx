'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/layout/Logo'
import { CartLink } from '@/components/layout/CartLink'
import { AccountMenu } from '@/components/layout/AccountMenu'
import { cn } from '@/lib/utils'
import type { Customer } from '@/lib/queries/customers'

export function Nav({ customer }: { customer: Customer | null }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 bg-white/92 backdrop-blur-[20px] transition-shadow',
        scrolled ? 'border-b border-gray-light' : 'border-b border-transparent'
      )}
    >
      <div className="container flex h-16 items-center gap-2">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Logo size={30} />
          <span className="flex items-baseline gap-1 font-display">
            <span className="font-normal text-charcoal">Mi </span>
            <span className="font-extrabold text-charcoal">Estampa</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:gap-6">
          <Link
            href="/catalogo"
            className="whitespace-nowrap font-display text-sm font-bold text-charcoal transition hover:text-coral"
          >
            Catálogo
          </Link>
          <CartLink />
          <AccountMenu customer={customer} />
        </div>
      </div>
    </header>
  )
}
