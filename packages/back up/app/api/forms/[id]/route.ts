import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const { data: form, error } = await supabase
      .from('forms')
      .select('id, name, user_id, whatsapp_phone')
      .eq('id', id)
      .single();

    if (error || !form) {
      return new Response(
        JSON.stringify({ error: 'Form not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener nombre del consultorio desde profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', form.user_id)
      .single();

    return new Response(
      JSON.stringify({
        id: form.id,
        consultorio_name: profile?.name || 'Consultorio',
        whatsapp_phone: form.whatsapp_phone,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('GET /api/forms/[id] error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}