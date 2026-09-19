import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: formId } = await params;

    const { data: form, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single();

    if (error || !form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json({ form });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: formId } = await params;
    const body = await req.json();
    const { name, description, fields, whatsapp_phone } = body;

    // Build update object with only provided fields
    const updateData: any = {};

    if (name !== undefined) {
      if (!name || !name.trim()) {
        return NextResponse.json(
          { error: 'El nombre del formulario es requerido' },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (description !== undefined) {
      updateData.description = description || null;
    }

    if (fields !== undefined) {
      updateData.fields = fields;
    }

    if (whatsapp_phone !== undefined) {
      updateData.whatsapp_phone = whatsapp_phone || null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updateData.updated_at = new Date().toISOString();

    const { data: form, error } = await supabase
      .from('forms')
      .update(updateData)
      .eq('id', formId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update form' },
        { status: 500 }
      );
    }

    return NextResponse.json({ form });
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

    // Delete form (cascade will delete related leads)
    const { error } = await supabase
      .from('forms')
      .delete()
      .eq('id', formId);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to delete form' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}