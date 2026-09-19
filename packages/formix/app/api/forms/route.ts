import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

interface FormField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  urgent: boolean;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, fields } = await req.json();

    if (!name || !fields || fields.length === 0) {
      return NextResponse.json(
        { error: 'Form name and fields are required' },
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

    // Create form in database
    const { data: form, error } = await supabase
      .from('forms')
      .insert({
        user_id: user.id,
        name: name,
        description: '', // Optional: can add description in future
        fields: fields, // Store fields as JSON
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        message: 'Form created successfully',
        formId: form.id,
        form: form,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Form creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
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
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all forms for this user
    const { data: forms, error } = await supabase
      .from('forms')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(forms, { status: 200 });
  } catch (error: any) {
    console.error('Form retrieval error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}