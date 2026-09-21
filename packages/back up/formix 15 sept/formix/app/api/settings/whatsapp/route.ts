import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { phone } = body;

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^\+\d{1,3}\s?\d{6,14}$/;
    if (!phoneRegex.test(phone.trim())) {
      return NextResponse.json(
        { error: 'Invalid phone format. Use: +34 612 345 678' },
        { status: 400 }
      );
    }

    // Save to user profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({ whatsapp_phone: phone.trim() })
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save phone number' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      phone: phone.trim(),
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}