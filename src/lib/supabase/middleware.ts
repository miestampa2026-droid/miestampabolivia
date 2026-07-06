import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const PUBLIC_ACCOUNT_PATHS = ['/cuenta/login', '/cuenta/registro', '/cuenta/recuperar']

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request: { headers: request.headers } })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      }
    }
  })

  // No usar getSession() acá: getUser() revalida el token contra Supabase
  // en vez de confiar en la cookie tal cual llega.
  const {
    data: { user }
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAccountArea = pathname.startsWith('/cuenta')
  const isAdminArea = pathname.startsWith('/admin')
  const isPublicAccountPath = PUBLIC_ACCOUNT_PATHS.some((p) => pathname.startsWith(p))

  if (isAccountArea && !isPublicAccountPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/cuenta/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (isPublicAccountPath && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/cuenta'
    url.search = ''
    return NextResponse.redirect(url)
  }

  if (isAdminArea) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/cuenta/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    const { data: customer } = await supabase
      .from('customers')
      .select('is_admin')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (!customer?.is_admin) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  return response
}
