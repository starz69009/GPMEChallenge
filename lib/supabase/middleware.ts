import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env vars are missing, just pass through
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            )
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            )
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    // Public routes that don't require auth
    const publicRoutes = ['/login', '/signup-admin']
    const isPublicRoute = publicRoutes.some(r => pathname.startsWith(r))

    if (!user && !isPublicRoute && pathname !== '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // If user is logged in and goes to login/signup pages, redirect based on role
    if (user && isPublicRoute) {
      const url = request.nextUrl.clone()
      const isAdmin = user.user_metadata?.is_admin === true
      url.pathname = isAdmin ? '/admin' : '/equipe'
      return NextResponse.redirect(url)
    }

    // Redirect root to login
    if (pathname === '/') {
      const url = request.nextUrl.clone()
      if (user) {
        const isAdmin = user.user_metadata?.is_admin === true
        url.pathname = isAdmin ? '/admin' : '/equipe'
      } else {
        url.pathname = '/login'
      }
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch {
    // If Supabase fails, pass through to avoid crashing
    return NextResponse.next({ request })
  }
}
