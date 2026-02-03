
import Stripe from 'stripe';
import { neon } from '@netlify/neon';

const getStripe = (): Stripe | null => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  return new Stripe(secretKey);
};

const getSql = () => {
  const url = process.env.NETLIFY_DATABASE_URL;
  if (!url) return null;
  return neon(url);
};

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  const stripe = getStripe();
  const sql = getSql();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe) {
    console.error('Stripe not configured');
    return { statusCode: 500, headers, body: 'Stripe not configured' };
  }

  if (!sql) {
    console.error('Database not configured');
    return { statusCode: 500, headers, body: 'Database not configured' };
  }

  if (!webhookSecret) {
    console.error('Webhook secret not configured');
    return { statusCode: 500, headers, body: 'Webhook secret not configured' };
  }

  // Get signature from headers (case-insensitive)
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];

  if (!sig) {
    console.error('Missing stripe-signature header');
    return { statusCode: 400, headers, body: 'Missing stripe-signature header' };
  }

  let stripeEvent: Stripe.Event;

  try {
    // Use raw body for signature verification
    const rawBody = event.body;
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, headers, body: `Webhook Error: ${err.message}` };
  }

  console.log(`Received Stripe event: ${stripeEvent.type}`);

  try {
    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        console.log(`Checkout completed for user ${userId}, subscription ${subscriptionId}`);

        if (userId && subscriptionId) {
          await sql`UPDATE hypeakz_users SET
            unlimited_status = true,
            paid = true,
            stripe_subscription_id = ${subscriptionId},
            stripe_customer_id = ${customerId},
            subscription_status = 'active'
            WHERE id = ${userId}`;
          console.log(`User ${userId} upgraded to premium`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        const status = subscription.status;

        console.log(`Subscription updated for user ${userId}: ${status}`);

        if (userId) {
          const isActive = status === 'active' || status === 'trialing';
          await sql`UPDATE hypeakz_users SET
            unlimited_status = ${isActive},
            paid = ${isActive},
            subscription_status = ${status}
            WHERE id = ${userId}`;
        } else {
          // Try to find user by subscription ID
          const subscriptionId = subscription.id;
          const isActive = status === 'active' || status === 'trialing';
          await sql`UPDATE hypeakz_users SET
            unlimited_status = ${isActive},
            paid = ${isActive},
            subscription_status = ${status}
            WHERE stripe_subscription_id = ${subscriptionId}`;
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        const subscriptionId = subscription.id;

        console.log(`Subscription deleted for user ${userId || 'unknown'}`);

        if (userId) {
          await sql`UPDATE hypeakz_users SET
            unlimited_status = false,
            paid = false,
            subscription_status = 'cancelled'
            WHERE id = ${userId}`;
        } else {
          await sql`UPDATE hypeakz_users SET
            unlimited_status = false,
            paid = false,
            subscription_status = 'cancelled'
            WHERE stripe_subscription_id = ${subscriptionId}`;
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = stripeEvent.data.object as any;
        const subscriptionId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id || invoice.parent?.subscription_details?.subscription;

        console.log(`Payment failed for subscription ${subscriptionId}`);

        if (subscriptionId) {
          await sql`UPDATE hypeakz_users SET
            subscription_status = 'payment_failed'
            WHERE stripe_subscription_id = ${subscriptionId}`;
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = stripeEvent.data.object as any;
        const subscriptionId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id || invoice.parent?.subscription_details?.subscription;

        console.log(`Invoice paid for subscription ${subscriptionId}`);

        if (subscriptionId) {
          await sql`UPDATE hypeakz_users SET
            unlimited_status = true,
            paid = true,
            subscription_status = 'active'
            WHERE stripe_subscription_id = ${subscriptionId}`;
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true })
    };

  } catch (error: any) {
    console.error('Error handling webhook:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
