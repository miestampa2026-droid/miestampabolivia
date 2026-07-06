'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase/client'
import { GoogleAuthButton } from '@/components/account/GoogleAuthButton'

const inputClass =
  'w-full rounded-md border-[1.5px] border-gray-light bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10'

export default function RegistroPage() {
  const router = useRouter()
  const [form, setForm] = useState({ nombre: '', email: '', whatsapp: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmEmailSent, setConfirmEmailSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setLoading(true)
    const supabase = createBrowserSupabase()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.nombre, phone: form.whatsapp },
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect_to=/cuenta`
      }
    })
    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.session) {
      router.push('/cuenta')
      router.refresh()
    } else {
      setConfirmEmailSent(true)
    }
  }

  return (
    <main className="min-h-dvh bg-off-white">
      <div className="container flex justify-center py-12 sm:py-16">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card-sm sm:p-10">
          <h1 className="mb-6 text-center font-display text-2xl font-bold text-charcoal">
            Creá tu cuenta
          </h1>

          {confirmEmailSent ? (
            <p className="rounded-md bg-coral-light px-4 py-3 text-center font-body text-sm text-coral-dark">
              Te enviamos un correo a <strong>{form.email}</strong> para confirmar tu cuenta. Abrilo para
              continuar.
            </p>
          ) : (
            <>
              <GoogleAuthButton label="Registrarme con Google" />

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-light" />
                <span className="font-body text-sm text-gray-mid">o con tu email</span>
                <span className="h-px flex-1 bg-gray-light" />
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                  <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
                    Nombre completo
                  </label>
                  <input
                    className={inputClass}
                    value={form.nombre}
                    onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
                    Email
                  </label>
                  <input
                    className={inputClass}
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
                    WhatsApp
                  </label>
                  <input
                    className={inputClass}
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                    placeholder="7XXXXXXX"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
                    Contraseña
                  </label>
                  <input
                    className={inputClass}
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Mínimo 8 caracteres"
                    minLength={8}
                    required
                  />
                </div>

                {error && <p className="font-body text-sm text-brand-error">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-full bg-coral px-7 py-3 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md disabled:pointer-events-none disabled:opacity-60"
                >
                  {loading ? 'Creando cuenta…' : 'Registrarme'}
                </button>
              </form>
            </>
          )}

          <p className="mt-6 text-center font-body text-sm text-gray-mid">
            ¿Ya tenés cuenta?{' '}
            <Link href="/cuenta/login" className="font-semibold text-coral hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
