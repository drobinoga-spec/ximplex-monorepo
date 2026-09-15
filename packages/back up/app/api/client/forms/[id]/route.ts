import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = session.user.id;
    const resolvedParams = await params;
    const formId = resolvedParams.id;
    const body = await request.json();

        // Verify form ownership
    const { data: form, error: fetchError } = await supabase
      .from('forms')
      .select('id, user_id, name')
      .eq('id', formId)
      .single();

    if (fetchError || !form || form.user_id !== userId) {
      return new Response(JSON.stringify({ error: 'Form not found or unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update form
    const { data: updatedForm, error: updateError } = await supabase
      .from('forms')
      .update({
        name: body.name || form.name,
        description: body.description || null,
        whatsapp_phone: body.whatsapp_phone || null,
        fields: body.fields || [],
        updated_at: new Date().toISOString(),
      })
      .eq('id', formId)
      .select()
      .single();

    if (updateError) {
      console.error('Form update error:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update form' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(updatedForm), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('PATCH /api/client/forms/[id] error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = session.user.id;
    const resolvedParams = await params;
    const formId = resolvedParams.id;

    const { data: form, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .eq('user_id', userId)
      .single();

    if (error || !form) {
      return new Response(JSON.stringify({ error: 'Form not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(form), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET /api/client/forms/[id] error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = session.user.id;
    const resolvedParams = await params;
    const formId = resolvedParams.id;

    // Verify form ownership
    const { data: form, error: fetchError } = await supabase
      .from('forms')
      .select('id, user_id')
      .eq('id', formId)
      .single();

    if (fetchError || !form || form.user_id !== userId) {
      return new Response(JSON.stringify({ error: 'Form not found or unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Soft delete: set is_active to false
    const { error: deleteError } = await supabase
      .from('forms')
      .update({ is_active: false })
      .eq('id', formId);

    if (deleteError) {
      console.error('Form delete error:', deleteError);
      return new Response(JSON.stringify({ error: 'Failed to delete form' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Form deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('DELETE /api/client/forms/[id] error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}