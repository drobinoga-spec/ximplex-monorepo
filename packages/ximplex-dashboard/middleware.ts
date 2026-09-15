import { NextRequest, NextResponse } from 'next/server';
import { validateSecretSession } from './lib/secretSessions';

export function middleware(request: NextRequest) {
  // Proteger solo la ruta /my-desk
  if (request.nextUrl.pathname === '/my-desk') {
    const cookieValue = request.cookies.get('ximplex_secret')?.value;
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                     request.headers.get('x-real-ip') ||
                     '127.0.0.1';

    // Validar que tenga cookie y sea válida
    if (!cookieValue || !validateSecretSession(cookieValue, clientIp)) {
      // Redirigir a home si no tiene acceso
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/my-desk'],
};