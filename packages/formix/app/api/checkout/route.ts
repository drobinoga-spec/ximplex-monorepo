import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_API_VERSION as any,
});

export async function POST(request: NextRequest) {
  try {
    const { priceId, userEmail } = await request.json();

    if (!priceId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing priceId or userEmail' },
        { status: 400 }
      );
    }

    // Crear o recuperar customer
    let customer = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    let customerId: string;

    if (customer.data.length > 0) {
      customerId = customer.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: userEmail,
      });
      customerId = newCustomer.id;
    }

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      allow_promotion_codes: true,
    });

    return NextResponse.json(
      { sessionId: session.id, url: session.url },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}