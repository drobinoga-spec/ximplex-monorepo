import { getToken } from 'next-auth/jwt';
import { validateSecretSession } from '@/lib/secretSessions';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Proteger la ruta /my-desk
  if (request.nextUrl.pathname.startsWith('/my-desk')) {
    // 1. Chequear acceso secreto con IP (backdoor access)
    const secretToken = request.cookies.get('formix_secret')?.value;
    if (secretToken) {
      // Obtener IP actual del cliente
      const currentIp =
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        'unknown';

      // Validar token + IP
      if (validateSecretSession(secretToken, currentIp)) {
        return NextResponse.next();
      }
      // Si el token no es válido (IP diferente o expirado), continúa al siguiente check
    }

    // 2. Si no tiene acceso secreto válido, chequear NextAuth session
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // Verificar que el usuario esté autenticado
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Verificar que sea el admin (drobinoga@gmail.com)
    if (token.email !== 'drobinoga@gmail.com') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/my-desk/:path*'],
};
