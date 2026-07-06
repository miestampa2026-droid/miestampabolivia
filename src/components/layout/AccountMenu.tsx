'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, ChevronDown } from 'lucide-react'
import { createBrowserSupabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { Customer } from '@/lib/queries/customers'

export function AccountMenu({ customer }: { customer: Customer | null }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  if (!customer) {
    return (
      <Link
        href="/cuenta/login"
        className="whitespace-nowrap rounded-full bg-coral px-2.5 py-2 font-display text-sm font-bold text-white transition hover:bg-coral-dark sm:px-5"
      >
        Iniciar sesión
      </Link>
    )
  }

  const initial = (customer.name || customer.email || '?').trim().charAt(0).toUpperCase()

  async function handleSignOut() {
    const supabase = createBrowserSupabase()
    await supabase.auth.signOut()
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2 text-charcoal transition hover:text-coral"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral font-display text-sm font-bold text-white">
          {initial || <User size={16} aria-hidden />}
        </span>
        <ChevronDown size={16} className={cn('transition', open && 'rotate-180')} aria-hidden />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-gray-light bg-white p-2 shadow-card-lg"
        >
          <p className="truncate px-3 py-2 font-body text-sm text-gray-mid">{customer.email}</p>
          <Link
            href="/cuenta"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 font-display text-sm font-semibold text-charcoal hover:bg-gray-light"
          >
            Mi cuenta
          </Link>
          <Link
            href="/cuenta/pedidos"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 font-display text-sm font-semibold text-charcoal hover:bg-gray-light"
          >
            Mis pedidos
          </Link>
          <Link
            href="/cuenta/favoritos"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 font-display text-sm font-semibold text-charcoal hover:bg-gray-light"
          >
            Favoritos
          </Link>
          {customer.is_admin && (
            <Link
              href="/admin/pedidos"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 font-display text-sm font-semibold text-coral hover:bg-gray-light"
            >
              Panel admin
            </Link>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-1 block w-full rounded-md px-3 py-2 text-left font-display text-sm font-semibold text-brand-error hover:bg-gray-light"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
