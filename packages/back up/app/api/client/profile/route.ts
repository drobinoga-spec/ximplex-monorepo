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

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, name, whatsapp_phone')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Profile fetch error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch profile' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(profile),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('GET /api/client/profile error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { name, whatsapp_phone } = await request.json();

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update({
        name: name || null,
        whatsapp_phone: whatsapp_phone || null,
      })
      .eq('id', session.user.id)
      .select('id, email, name, whatsapp_phone')
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to update profile' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(updatedProfile),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('PATCH /api/client/profile error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}