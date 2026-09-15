import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const gastos = [
      { id: 1, nombre: 'Dominio ximplex.com', frecuencia: 'Anual', monto: 12, proximo: '2026-09-15' },
      { id: 2, nombre: 'Supabase (BD + Auth)', frecuencia: 'Mensual', monto: 25, proximo: '2026-09-10' },
      { id: 3, nombre: 'Railway (Hosting Backend)', frecuencia: 'Mensual', monto: 10, proximo: '2026-09-05' },
      { id: 4, nombre: 'Vercel (Hosting Frontend)', frecuencia: 'Mensual', monto: 0, proximo: '2026-09-01' },
      { id: 5, nombre: 'Stripe (Comisiones)', frecuencia: 'Variable', monto: 45, proximo: 'Varía' },
    ];

    return NextResponse.json({
      success: true,
      data: gastos,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}