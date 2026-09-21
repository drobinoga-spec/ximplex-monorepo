import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { sendWhatsAppNotification } from '@/lib/twilio';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: formId } = await params;
    const body = await req.json();
    const { data: testData } = body;

    // Get form with WhatsApp phone
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('id, name, whatsapp_phone')
      .eq('id', formId)
      .single();

    if (formError || !form) {
      return NextResponse.json(
        { error: 'Formulario no encontrado' },
        { status: 404 }
      );
    }

    if (!form.whatsapp_phone) {
      return NextResponse.json(
        { error: 'Número de WhatsApp no configurado' },
        { status: 400 }
      );
    }

    // Send test message
    const result = await sendWhatsAppNotification(
      form.whatsapp_phone,
      form.name,
      testData
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test enviado correctamente',
      });
    } else {
      return NextResponse.json(
        { error: 'Error al enviar test' },
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