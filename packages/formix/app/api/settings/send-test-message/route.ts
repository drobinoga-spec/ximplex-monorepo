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

    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, whatsapp_phone')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.whatsapp_phone) {
      return NextResponse.json(
        { error: 'WhatsApp phone not configured' },
        { status: 400 }
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID!;
    const apiKeySid = process.env.TWILIO_API_KEY_SID!;
    const apiKeySecret = process.env.TWILIO_API_KEY_SECRET!;
    const whatsappFrom = process.env.TWILIO_WHATSAPP_NUMBER!;

    const auth = Buffer.from(`${apiKeySid}:${apiKeySecret}`).toString('base64');

    const params = new URLSearchParams({
      From: `whatsapp:${whatsappFrom}`,
      To: `whatsapp:${user.whatsapp_phone}`,
      Body: '✅ Tu WhatsApp está configurado correctamente en Formix',
    });

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    const data = await response.json();
    console.log('Twilio response:', { status: response.status, data });

    if (!response.ok) {
      console.error('Twilio error:', data);
      return NextResponse.json(
        { error: data.message || 'Could not send message' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: 'Test message sent', messageSid: data.sid },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}