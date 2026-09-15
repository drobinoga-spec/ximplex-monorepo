import { NextRequest, NextResponse } from 'next/server';
import { createSecretSession } from '@/lib/secretSessions';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1';

    // Validar contraseña
    if (password !== 'misha') {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // Generar token de sesión
    const token = createSecretSession(clientIp);

    // Retornar token para que el cliente lo guarde en cookie
    return NextResponse.json(
      { token, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en verify-secret:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}