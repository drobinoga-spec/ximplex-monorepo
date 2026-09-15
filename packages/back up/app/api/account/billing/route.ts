import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_API_VERSION as any,
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, subscription_plan, subscription_status')
      .eq('email', userEmail)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    let nextBillingDate: string | undefined;
    let currentPeriodEnd: string | undefined;

    try {
      const customers = await stripe.customers.list({
        email: userEmail,
        limit: 1,
      });

      if (customers.data.length > 0) {
        const customerId = customers.data[0].id;
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          limit: 1,
          status: 'active',
        });

        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0] as any;
          const periodEnd = (subscription.current_period_end as number) || 0;
          nextBillingDate = new Date(periodEnd * 1000).toISOString();
          currentPeriodEnd = new Date(periodEnd * 1000).toISOString();
        }
      }
    } catch (error) {
      console.error('Error fetching Stripe subscription:', error);
    }

    return NextResponse.json({
      plan: user.subscription_plan || 'free',
      status: user.subscription_status || 'inactive',
      nextBillingDate,
      currentPeriodEnd,
    });
  } catch (error) {
    console.error('Error en /api/account/billing:', error);
    return NextResponse.json(
      { error: 'Error al traer datos de facturación' },
      { status: 500 }
    );
  }
}