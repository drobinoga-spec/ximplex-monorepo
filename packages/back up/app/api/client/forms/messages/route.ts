import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@/app/api/auth/[...nextauth]/route';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: obtener respuestas de un formulario
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');

    if (!formId) {
      return NextResponse.json(
        { error: 'Form ID es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario es dueño del formulario
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', session.user.email)
      .single();

    const { data: form } = await supabase
      .from('forms')
      .select('user_id')
      .eq('id', formId)
      .single();

    if (!form || form.user_id !== profile?.user_id) {
      return NextResponse.json(
        { error: 'No tienes acceso a este formulario' },
        { status: 403 }
      );
    }

    // Obtener mensajes
    const { data: messages, error } = await supabase
      .from('leads')
      .select('id, data, submitted_at, whatsapp_sent')
      .eq('form_id', formId)
      .order('submitted_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Error al obtener respuestas' },
      { status: 500 }
    );
  }
}

// POST: guardar una nueva respuesta (público, sin auth)
export async function POST(request: NextRequest) {
  try {
    const { formId, data, whatsappPhone } = await request.json();

    if (!formId || !data) {
      return NextResponse.json(
        { error: 'Form ID y data son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el formulario existe
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('id, whatsapp_phone')
      .eq('id', formId)
      .single();

    if (formError || !form) {
      return NextResponse.json(
        { error: 'Formulario no encontrado' },
        { status: 404 }
      );
    }

    // Guardar respuesta
    const { data: message, error } = await supabase
      .from('leads')
      .insert({
        form_id: formId,
        data,
        whatsapp_sent: false,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // TODO: Enviar a WhatsApp si está configurado
    // if (form.whatsapp_phone) {
    //   await sendWhatsappMessage(form.whatsapp_phone, data);
    // }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json(
      { error: 'Error al guardar respuesta' },
      { status: 500 }
    );
  }
}