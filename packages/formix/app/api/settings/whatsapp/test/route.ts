import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendWhatsAppNotification } from '@/lib/twilio';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user ID from email
    const { data: user } = await supabase
      .from('profiles')
      .select('id, whatsapp_phone')
      .eq('email', session.user.email)
      .single();

    if (!user?.whatsapp_phone) {
      return NextResponse.json(
        { error: 'WhatsApp number not configured' },
        { status: 400 }
      );
    }

    // Send test message
    const testData = {
      test: 'Mensaje de prueba',
      timestamp: new Date().toLocaleString('es-ES'),
    };

    const result = await sendWhatsAppNotification(
      user.whatsapp_phone,
      'Test Formix',
      testData
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Mensaje de test enviado correctamente',
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send test message' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
