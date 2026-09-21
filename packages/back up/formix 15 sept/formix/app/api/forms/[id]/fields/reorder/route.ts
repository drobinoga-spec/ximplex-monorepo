import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: formId } = await params;
    const body = await req.json();
    const { fields } = body;

    if (!fields || !Array.isArray(fields)) {
      return NextResponse.json(
        { error: 'Invalid fields array' },
        { status: 400 }
      );
    }

    // Update form with reordered fields
    const { data: form, error } = await supabase
      .from('forms')
      .update({ fields })
      .eq('id', formId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to reorder fields' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      form,
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}