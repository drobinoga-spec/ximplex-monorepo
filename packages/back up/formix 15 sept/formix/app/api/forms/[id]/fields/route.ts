import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: formId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { label, type, required, placeholder } = await req.json();

    if (!label || !type) {
      return NextResponse.json(
        { error: 'Label and type are required' },
        { status: 400 }
      );
    }

    // Get the current form
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single();

    if (formError || !form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Create new field object
    const newField = {
      id: Math.random().toString(36).substr(2, 9),
      label,
      type,
      required: required || false,
      placeholder: placeholder || '',
      order: (form.fields?.length || 0) + 1,
    };

    // Add field to form's fields array
    const updatedFields = [...(form.fields || []), newField];

    // Update form with new fields
    const { data: updatedForm, error: updateError } = await supabase
      .from('forms')
      .update({ fields: updatedFields })
      .eq('id', formId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ form: updatedForm, field: newField }, { status: 201 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: formId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fieldId } = await req.json();

    if (!fieldId) {
      return NextResponse.json(
        { error: 'Field ID is required' },
        { status: 400 }
      );
    }

    // Get the current form
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single();

    if (formError || !form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Remove field from fields array
    const updatedFields = (form.fields || []).filter(
      (f: any) => f.id !== fieldId
    );

    // Update form
    const { data: updatedForm, error: updateError } = await supabase
      .from('forms')
      .update({ fields: updatedFields })
      .eq('id', formId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ form: updatedForm });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
