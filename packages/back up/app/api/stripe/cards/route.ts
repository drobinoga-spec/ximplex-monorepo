import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = session.user.id;

    // Get user's Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (profileError || !profile || !profile.stripe_customer_id) {
      return new Response(JSON.stringify({ cards: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get payment methods from Stripe
    const paymentMethods = await stripe.customers.listPaymentMethods(
      profile.stripe_customer_id,
      { type: 'card' }
    );

    const cards = paymentMethods.data.map(pm => ({
      id: pm.id,
      brand: (pm.card as any)?.brand,
      last4: (pm.card as any)?.last4,
      expMonth: (pm.card as any)?.exp_month,
      expYear: (pm.card as any)?.exp_year,
    }));

    return new Response(JSON.stringify({ cards }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET /api/stripe/cards error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}