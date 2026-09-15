import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { name, email, whatsapp, message, is_emergency } =
      await request.json();

    // Validar que el formulario existe
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('id, user_id, whatsapp_phone')
      .eq('id', id)
      .single();

    if (formError || !form) {
      return new Response(
        JSON.stringify({ error: 'Form not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Guardar respuesta en form_messages
    const { data: response, error: submitError } = await supabase
      .from('form_messages')
      .insert([
        {
          form_id: id,
          user_id: form.user_id,
          name,
          email: email || null,
          whatsapp,
          message,
          is_emergency: is_emergency || false,
          submitted_at: new Date().toISOString(),
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown',
        },
      ])
      .select('id')
      .single();

    if (submitError) {
      console.error('Submit error:', submitError);
      return new Response(
        JSON.stringify({ error: 'Failed to submit form' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // TODO: Enviar notificación WhatsApp al consultorio
    // (Próximo paso)

    return new Response(
      JSON.stringify({
        success: true,
        message_id: response.id,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('POST /api/forms/[id]/submit error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}