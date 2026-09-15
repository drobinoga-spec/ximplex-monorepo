import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_API_VERSION as any,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    // Guardar evento en BD
    await supabase.from('stripe_events').insert({
      stripe_event_id: event.id,
      event_type: event.type,
      data: event.data,
      processed: false,
    });

    switch (event.type) {
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Marcar como procesado
    await supabase
      .from('stripe_events')
      .update({ processed: true })
      .eq('stripe_event_id', event.id);

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('=== PAYMENT SUCCEEDED STARTED ===');
  console.log('Invoice ID:', invoice.id);
  console.log('Invoice customer:', invoice.customer);

  if (!invoice.customer || typeof invoice.customer !== 'string') {
    console.error('No customer in invoice');
    return;
  }

  try {
    console.log('Step 1: Retrieving customer from Stripe...');
    const customer = await stripe.customers.retrieve(invoice.customer);
    console.log('Customer retrieved:', customer);

    if (customer.deleted) {
      console.error('Customer is deleted');
      return;
    }

    const userEmail = customer.email;
    console.log('Step 2: User email from customer:', userEmail);

    if (!userEmail) {
      console.error('No email found for customer');
      return;
    }

    const subscriptionId = (invoice as any).subscription as string;
    console.log('Step 3: Subscription ID from invoice:', subscriptionId);

    if (!subscriptionId) {
      console.error('No subscription in invoice');
      return;
    }

    console.log('Step 4: Retrieving subscription from Stripe...');
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    console.log('Subscription retrieved:', subscription);

    let planName = 'free';
    if (subscription.items.data.length > 0) {
      const priceId = subscription.items.data[0].price.id;
      console.log('Price ID:', priceId);

      if (priceId === process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID) {
        planName = 'starter';
      } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) {
        planName = 'pro';
      }
    }
    console.log('Plan name determined:', planName);

    console.log('Step 5: Searching user in Supabase with email:', userEmail);
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single();

    console.log('Supabase query result - User:', user, 'Error:', userError);

    if (userError || !user) {
      console.error('User not found in Supabase:', userEmail, userError);
      return;
    }

    console.log('Step 6: Updating user in Supabase...');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_plan: planName,
        subscription_status: 'active',
        subscription_updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
    } else {
      console.log(`✅ Successfully updated user ${userEmail} to plan: ${planName}`);
    }

    console.log('=== PAYMENT SUCCEEDED COMPLETED ===');
  } catch (error) {
    console.error('Error processing payment succeeded:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);

  try {
    const customer = await stripe.customers.retrieve(subscription.customer as string);

    if (customer.deleted) {
      console.error('Customer is deleted');
      return;
    }

    const userEmail = customer.email;

    if (!userEmail) {
      console.error('No email found for customer');
      return;
    }

    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError || !user) {
      console.error('User not found:', userEmail);
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_plan: 'free',
        subscription_status: 'cancelled',
        subscription_updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
    } else {
      console.log(`Downgraded user ${userEmail} to free plan`);
    }
  } catch (error) {
    console.error('Error processing subscription deleted:', error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed:', invoice.id);

  if (!invoice.customer || typeof invoice.customer !== 'string') {
    console.error('No customer in invoice');
    return;
  }

  try {
    const customer = await stripe.customers.retrieve(invoice.customer);

    if (customer.deleted) {
      console.error('Customer is deleted');
      return;
    }

    const userEmail = customer.email;

    if (!userEmail) {
      console.error('No email found for customer');
      return;
    }

    console.log(`Payment failed for user: ${userEmail}`);
    // TODO: Send email to user about payment failure
  } catch (error) {
    console.error('Error processing payment failed:', error);
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);

  try {
    const customer = await stripe.customers.retrieve(session.customer as string);

    if (customer.deleted) {
      console.error('Customer is deleted');
      return;
    }

    const userEmail = customer.email;

    if (!userEmail) {
      console.error('No email found for customer');
      return;
    }

    const subscriptionId = session.subscription as string;
    if (!subscriptionId) {
      console.error('No subscription in session');
      return;
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    let planName = 'free';
    if (subscription.items.data.length > 0) {
      const priceId = subscription.items.data[0].price.id;

      if (priceId === process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID) {
        planName = 'starter';
      } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) {
        planName = 'pro';
      }
    }

    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError || !user) {
      console.error('User not found:', userEmail);
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_plan: planName,
        subscription_status: 'active',
        subscription_updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
    } else {
      console.log(`✅ Checkout completed for user ${userEmail}, plan: ${planName}`);
    }
  } catch (error) {
    console.error('Error processing checkout session:', error);
  }
}