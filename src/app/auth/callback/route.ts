import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

// Recibe el "code" que Supabase agrega al volver de Google OAuth o de un
// link de recuperación de contraseña, y lo cambia por una sesión.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirect_to') ?? '/cuenta'

  if (code) {
    const supabase = createServerSupabase()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}${redirectTo}`)
}
