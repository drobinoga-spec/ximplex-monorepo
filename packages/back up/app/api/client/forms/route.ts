import { getServerSession } from 'next-auth/next';
import { createClient } from '@supabase/supabase-js';
import { authOptions } from '../../auth/[...nextauth]/route';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data: forms, error } = await supabase
      .from('forms')
      .select('id, name, description, created_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Forms fetch error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch forms' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(forms || []),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('GET /api/client/forms error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { name, description, template_id, fields } = await request.json();

    const { data: newForm, error } = await supabase
      .from('forms')
      .insert([
        {
          user_id: session.user.id,
          name: name || 'Nuevo Formulario',
          description: description || '',
          template_id: template_id || 'elegant',
          fields: fields || ['name', 'email', 'phone'],
          is_published: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select('id, name, description, template_id, fields')
      .single();

    if (error) {
      console.error('Form creation error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create form' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(newForm),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('POST /api/client/forms error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}