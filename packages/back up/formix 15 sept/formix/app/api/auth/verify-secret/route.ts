import { createSecretSession } from '@/lib/secretSessions';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Validar contraseña
    if (password !== 'misha') {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // Obtener IP del cliente
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Crear sesión secreta con la IP actual
    const token = createSecretSession(ip);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error en verify-secret:', error);
    return NextResponse.json(
      { error: 'Error procesando solicitud' },
      { status: 500 }
    );
  }
}