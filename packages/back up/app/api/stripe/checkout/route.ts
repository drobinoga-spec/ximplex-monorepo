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

    const { priceId } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID es requerido' },
        { status: 400 }
      );
    }

    // Obtener o crear customer en Stripe
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('stripe_customer_id, email')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          userEmail: session.user.email,
        },
      });

      customerId = customer.id;

      // Guardar customer ID en BD
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('email', session.user.email);
    }

    // Crear sesión de checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error al crear sesión de checkout' },
      { status: 500 }
    );
  }
}