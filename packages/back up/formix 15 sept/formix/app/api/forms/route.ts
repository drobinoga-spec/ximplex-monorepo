import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's forms
    const { data: forms, error } = await supabase
      .from('forms')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ forms: forms || [] });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

const { name, description } = await req.json();

if (!name) {
  return NextResponse.json({ error: 'Form name is required' }, { status: 400 });
}

// Get user's WhatsApp phone from profile
const { data: profile } = await supabase
  .from('profiles')
  .select('whatsapp_phone')
  .eq('id', session.user.id)
  .single();

// Create new form
const { data: form, error } = await supabase
  .from('forms')
  .insert([
    {
      user_id: session.user.id,
      name: name.trim(),
      description: description?.trim() || '',
      fields: [],
      status: 'draft',
      whatsapp_phone: profile?.whatsapp_phone || null,
    },
  ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ form }, { status: 201 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
