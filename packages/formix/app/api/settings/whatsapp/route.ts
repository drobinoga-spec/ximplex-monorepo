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

    const { whatsappNumber, deliveryMethod } = await req.json();

    if (!whatsappNumber || !deliveryMethod) {
      return NextResponse.json(
        { error: 'WhatsApp phone and delivery method required' },
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

    // Update WhatsApp settings - convert camelCase to snake_case for DB
    const { data, error } = await supabase
      .from('profiles')
      .update({
        whatsapp_phone: whatsappNumber,
        delivery_method: deliveryMethod,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Could not update WhatsApp settings' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'WhatsApp settings updated successfully', user: data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('WhatsApp settings error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  return POST(req);
}