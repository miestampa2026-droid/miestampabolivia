'use client'

import { Suspense, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase/client'
import { GoogleAuthButton } from '@/components/account/GoogleAuthButton'

const inputClass =
  'w-full rounded-md border-[1.5px] border-gray-light bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/cuenta'

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createBrowserSupabase()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    })
    setLoading(false)

    if (signInError) {
      setError('Email o contraseña incorrectos.')
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card-sm sm:p-10">
      <h1 className="mb-6 text-center font-display text-2xl font-bold text-charcoal">Iniciá sesión</h1>

      <GoogleAuthButton />

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-gray-light" />
        <span className="font-body text-sm text-gray-mid">o con tu email</span>
        <span className="h-px flex-1 bg-gray-light" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">Email</label>
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
            Contraseña
          </label>
          <input
            className={inputClass}
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="Tu contraseña"
            required
          />
        </div>

        <Link href="/cuenta/recuperar" className="text-right font-body text-sm text-coral hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>

        {error && <p className="font-body text-sm text-brand-error">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-full bg-coral px-7 py-3 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? 'Entrando…' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="mt-6 text-center font-body text-sm text-gray-mid">
        ¿No tenés cuenta?{' '}
        <Link href="/cuenta/registro" className="font-semibold text-coral hover:underline">
          Registrate
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-dvh bg-off-white">
      <div className="container flex justify-center py-12 sm:py-16">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}
