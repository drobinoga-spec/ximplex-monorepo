import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@/app/api/auth/[...nextauth]/route';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Obtener user_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', session.user.email)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Perfil no encontrado' },
        { status: 404 }
      );
    }

    // Total de formularios
    const { data: forms } = await supabase
      .from('forms')
      .select('id')
      .eq('user_id', profile.user_id);

    const totalForms = forms?.length || 0;

    // Total de respuestas (leads)
    const { data: allMessages } = await supabase
      .from('leads')
      .select('id')
      .in('form_id', forms?.map(f => f.id) || []);

    const totalMessages = allMessages?.length || 0;

    // Respuestas enviadas a WhatsApp
    const { data: sentMessages } = await supabase
      .from('leads')
      .select('id')
      .eq('whatsapp_sent', true)
      .in('form_id', forms?.map(f => f.id) || []);

    const totalSent = sentMessages?.length || 0;

    // Respuestas del último mes
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: lastMonthMessages } = await supabase
      .from('leads')
      .select('id')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .in('form_id', forms?.map(f => f.id) || []);

    const lastMonthCount = lastMonthMessages?.length || 0;

    // Formularios activos
    const { data: activeForms } = await supabase
      .from('forms')
      .select('id')
      .eq('user_id', profile.user_id)
      .eq('status', 'active');

    const totalActive = activeForms?.length || 0;

    return NextResponse.json({
      totalForms,
      totalMessages,
      totalSent,
      lastMonthCount,
      totalActive,
      conversationRate: totalMessages > 0 ? ((totalSent / totalMessages) * 100).toFixed(2) : 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}