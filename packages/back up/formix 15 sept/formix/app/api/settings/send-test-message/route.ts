import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import twilio from 'twilio';

export async function POST(req: NextRequest) {
  try {
    // Get session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get user's WhatsApp number from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('whatsapp_phone')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile?.whatsapp_phone) {
      return NextResponse.json(
        { error: 'WhatsApp number not configured' },
        { status: 400 }
      );
    }

    // Initialize Twilio client
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Send WhatsApp message
    const result = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${profile.whatsapp_phone}`,
      body: message,
    });

    return NextResponse.json(
      {
        success: true,
        messageId: result.sid,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error sending test message:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to send test message' },
      { status: 500 }
    );
  }
}