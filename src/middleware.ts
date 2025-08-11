import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  const unprotectedPaths = ['/sign-in', '/sign-up', '/subscribe'];

  // if user is not signed in and the current path is not an auth path, redirect the user to the sign-in page
  if (!session && !unprotectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // if user is signed in and the current path is an auth path, redirect the user to the home page
  if (session && (request.nextUrl.pathname.startsWith('/sign-in') || request.nextUrl.pathname.startsWith('/sign-up'))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (session) {
    const { data: user } = await supabase.from('users').select('subscription_status, role').eq('id', session.user.id).single();

    if (user && user.subscription_status !== 'active' && request.nextUrl.pathname !== '/subscribe') {
      return NextResponse.redirect(new URL('/subscribe', request.url));
    }

    if (user && user.role !== 'admin' && request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }


  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|locales|sw.js).*)',
  ],
}