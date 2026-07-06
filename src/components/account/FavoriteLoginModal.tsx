'use client'

import Link from 'next/link'
import { X } from 'lucide-react'

export function FavoriteLoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-card-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 text-gray-mid transition hover:text-charcoal"
        >
          <X size={18} aria-hidden />
        </button>

        <p className="mb-2 font-display text-lg font-bold text-charcoal">
          Iniciá sesión para guardar tus favoritos
        </p>
        <p className="mb-6 font-body text-sm text-gray-mid">
          Creá una cuenta gratis o iniciá sesión para no perder tus productos favoritos.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/cuenta/login"
            className="rounded-full bg-coral px-7 py-3 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/cuenta/registro"
            className="rounded-full border-2 border-coral px-7 py-3 font-display text-[15px] font-bold text-coral transition hover:bg-coral hover:text-white"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  )
}
