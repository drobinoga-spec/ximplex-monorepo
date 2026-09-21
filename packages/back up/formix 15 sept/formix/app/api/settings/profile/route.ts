import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile with WhatsApp phone
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('whatsapp_phone, user_id')
      .eq('user_id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found, which is ok for new users
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    // If profile doesn't exist, create it
    if (!profile) {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{ user_id: session.user.id, whatsapp_phone: null }])
        .select()
        .single();

      if (createError) {
        console.error('Supabase error:', createError);
        return NextResponse.json(
          { error: 'Failed to create profile' },
          { status: 500 }
        );
      }

      return NextResponse.json({ profile: newProfile });
    }

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}