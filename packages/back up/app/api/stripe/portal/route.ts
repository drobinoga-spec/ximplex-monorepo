import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@/app/api/auth/[...nextauth]/route';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_API_VERSION as any,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('email', session.user.email)
      .single();

    if (userError || !user || !user.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No stripe customer found' },
        { status: 404 }
      );
    }

    // Crear portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/billing`,
    });

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Error al crear sesión del portal' },
      { status: 500 }
    );
  }
}