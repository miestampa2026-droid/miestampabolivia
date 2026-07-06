'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { createBrowserSupabase } from '@/lib/supabase/client'

const inputClass =
  'w-full rounded-md border-[1.5px] border-gray-light bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10'

export default function RecuperarPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createBrowserSupabase()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?redirect_to=/cuenta/nueva-contrasena`
    })
    setLoading(false)

    if (resetError) {
      setError(resetError.message)
      return
    }
    setSent(true)
  }

  return (
    <main className="min-h-dvh bg-off-white">
      <div className="container flex justify-center py-12 sm:py-16">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card-sm sm:p-10">
          <h1 className="mb-2 text-center font-display text-2xl font-bold text-charcoal">
            Recuperar contraseña
          </h1>
          <p className="mb-6 text-center font-body text-sm text-gray-mid">
            Te mandamos un link para crear una nueva contraseña.
          </p>

          {sent ? (
            <p className="rounded-md bg-coral-light px-4 py-3 text-center font-body text-sm text-coral-dark">
              Revisá tu correo <strong>{email}</strong> y seguí el link para continuar.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
                  Email
                </label>
                <input
                  className={inputClass}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              {error && <p className="font-body text-sm text-brand-error">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-full bg-coral px-7 py-3 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md disabled:pointer-events-none disabled:opacity-60"
              >
                {loading ? 'Enviando…' : 'Enviar link'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center font-body text-sm text-gray-mid">
            <Link href="/cuenta/login" className="font-semibold text-coral hover:underline">
              Volver a iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
