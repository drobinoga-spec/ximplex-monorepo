import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: formId } = await params;

    // Get form (public endpoint, no auth required)
    const { data: form, error } = await supabase
      .from('forms')
      .select('id, name, description, fields, status')
      .eq('id', formId)
      .eq('status', 'draft') // Only return draft forms (published)
      .single();

    if (error || !form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ form });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
