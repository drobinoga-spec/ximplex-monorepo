import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { templateId } = await req.json();

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID required' },
        { status: 400 }
      );
    }

    // Get user ID from email
    const { data: user } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update template
    const { data, error } = await supabase
      .from('profiles')
      .update({
        whatsapp_template: templateId,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Could not save template' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Template saved successfully', user: data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Template error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  return POST(req);
}