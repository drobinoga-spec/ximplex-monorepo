import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Solo proteger rutas /admin y /dashboard
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    // Verificar si existe la cookie de sesión de NextAuth
    const token = request.cookies.get('next-auth.session-token')?.value

    if (!token) {
      // Redirigir a login si no hay token
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}