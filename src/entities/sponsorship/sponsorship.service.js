import { stripe, CURRENCY, FRONTEND_URL, toMinorUnits } from '../../core/config/stripe.js';
import Sponsorship from './sponsorship.model.js';
import {
  sendSubscriptionSetupEmails,
  sendMonthlyChargeSuccessEmails,
  sendMonthlyChargeFailureEmails,
} from '../../lib/emailTemplates.js';

const badRequest = (msg) => Object.assign(new Error(msg), { statusCode: 400 });
const notFound = (msg) => Object.assign(new Error(msg), { statusCode: 404 });

export const SponsorshipService = {
  /**
   * Create a Hosted Stripe Checkout Session for monthly child sponsorship.
   * Charges Month 1 payment upfront and saves the payment method for off-session cron charging.
   * Returns hosted Checkout URL for the frontend.
   */
  async createSetupCheckoutSession({ sponsorName, sponsorEmail, childId, amount = 30, interval = 'month' }) {
    if (!sponsorEmail) throw badRequest('sponsorEmail is required');
    if (!amount || amount <= 0) throw badRequest('A positive amount is required');

    // Reuse an existing Stripe customer for this email if one exists
    const existing = await stripe.customers.list({ email: sponsorEmail, limit: 1 });
    const customer = existing.data.length
      ? existing.data[0]
      : await stripe.customers.create({
          email: sponsorEmail,
          name: sponsorName,
          metadata: { role: 'sponsor' },
        });

    const sponsorship = await Sponsorship.create({
      sponsorName,
      sponsorEmail,
      childId,
      amount,
      currency: CURRENCY,
      interval,
      stripeCustomerId: customer.id,
      status: 'incomplete',
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customer.id,
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            unit_amount: toMinorUnits(amount),
            product_data: { name: 'Child Sponsorship - Monthly' },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        setup_future_usage: 'off_session',
        metadata: {
          sponsorshipId: String(sponsorship._id),
          childId: childId || '',
        },
      },
      metadata: {
        sponsorshipId: String(sponsorship._id),
        childId: childId || '',
      },
      success_url: `${FRONTEND_URL}/sponsorship/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/sponsorship/cancel`,
    });

    sponsorship.checkoutSessionId = session.id;
    await sponsorship.save();

    return {
      sponsorshipId: sponsorship._id,
      customerId: customer.id,
      url: session.url,
      sessionId: session.id,
    };
  },

  /**
   * Confirm the setup after frontend redirects back with session_id.
   * Saves the default payment method ID, sets next billing date (+1 month),
   * marks status as 'active', and emails Subscriber + Admin.
   */
  async confirmSetup(sessionId) {
    if (!sessionId) throw badRequest('sessionId is required');

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent.payment_method'],
    });

    if (session.payment_status !== 'paid') {
      return { paid: false, status: session.payment_status };
    }

    const sponsorshipId = session.metadata?.sponsorshipId;
    const sponsorship = sponsorshipId
      ? await Sponsorship.findById(sponsorshipId)
      : await Sponsorship.findOne({ checkoutSessionId: session.id });

    if (!sponsorship) throw notFound('Sponsorship record not found');

    const paymentIntent = typeof session.payment_intent === 'object' ? session.payment_intent : null;
    let paymentMethodId = null;

    if (paymentIntent && paymentIntent.payment_method) {
      paymentMethodId = typeof paymentIntent.payment_method === 'string'
        ? paymentIntent.payment_method
        : paymentIntent.payment_method.id;
    }

    if (paymentMethodId && session.customer) {
      await stripe.customers.update(session.customer, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    }

    const now = new Date();
    const nextBilling = new Date(now);
    nextBilling.setMonth(nextBilling.getMonth() + 1);

    const isFirstTimePaid = sponsorship.status !== 'active';

    sponsorship.status = 'active';
    sponsorship.defaultPaymentMethodId = paymentMethodId || sponsorship.defaultPaymentMethodId;
    sponsorship.lastPaymentAt = now;
    sponsorship.nextBillingDate = nextBilling;
    await sponsorship.save();

    if (isFirstTimePaid) {
      sendSubscriptionSetupEmails({
        sponsorEmail: sponsorship.sponsorEmail,
        sponsorName: sponsorship.sponsorName,
        childId: sponsorship.childId,
        amount: sponsorship.amount,
        currency: sponsorship.currency,
      }).catch((err) => console.error('Error sending subscription setup emails:', err));
    }

    return { paid: true, status: 'active', sponsorship };
  },

  /**
   * Scheduled Cron Job function: Finds all active subscriptions due for billing
   * and executes off-session charges via Stripe PaymentIntents.
   */
  async chargeDueSubscriptions() {
    const now = new Date();
    const dueSponsorships = await Sponsorship.find({
      status: 'active',
      nextBillingDate: { $lte: now },
    });

    const results = { total: dueSponsorships.length, succeeded: 0, failed: 0 };

    for (const sponsorship of dueSponsorships) {
      try {
        if (!sponsorship.stripeCustomerId || !sponsorship.defaultPaymentMethodId) {
          throw new Error('Missing Stripe customer or default payment method');
        }

        // Charge customer off-session
        const paymentIntent = await stripe.paymentIntents.create({
          amount: toMinorUnits(sponsorship.amount),
          currency: sponsorship.currency || CURRENCY,
          customer: sponsorship.stripeCustomerId,
          payment_method: sponsorship.defaultPaymentMethodId,
          off_session: true,
          confirm: true,
          metadata: {
            sponsorshipId: String(sponsorship._id),
            childId: sponsorship.childId || '',
          },
        });

        if (paymentIntent.status === 'succeeded') {
          const nextBilling = new Date(sponsorship.nextBillingDate || now);
          nextBilling.setMonth(nextBilling.getMonth() + 1);

          sponsorship.lastPaymentAt = new Date();
          sponsorship.nextBillingDate = nextBilling;
          sponsorship.status = 'active';
          await sponsorship.save();

          results.succeeded++;

          sendMonthlyChargeSuccessEmails({
            sponsorEmail: sponsorship.sponsorEmail,
            sponsorName: sponsorship.sponsorName,
            childId: sponsorship.childId,
            amount: sponsorship.amount,
            currency: sponsorship.currency,
          }).catch((err) => console.error('Error sending monthly charge success emails:', err));
        } else {
          throw new Error(`PaymentIntent status: ${paymentIntent.status}`);
        }
      } catch (error) {
        console.error(`Failed to charge sponsorship ${sponsorship._id}:`, error.message);
        sponsorship.status = 'past_due';
        await sponsorship.save();

        results.failed++;

        sendMonthlyChargeFailureEmails({
          sponsorEmail: sponsorship.sponsorEmail,
          sponsorName: sponsorship.sponsorName,
          childId: sponsorship.childId,
          amount: sponsorship.amount,
          currency: sponsorship.currency,
          errorReason: error.message,
        }).catch((err) => console.error('Error sending monthly charge failure emails:', err));
      }
    }

    return results;
  },

  async cancel(sponsorshipId) {
    const sponsorship = await Sponsorship.findById(sponsorshipId);
    if (!sponsorship) throw notFound('Sponsorship not found');

    sponsorship.status = 'canceled';
    await sponsorship.save();
    return { status: 'canceled', sponsorship };
  },

  async getStatus(sponsorshipId) {
    const sponsorship = await Sponsorship.findById(sponsorshipId);
    if (!sponsorship) throw notFound('Sponsorship not found');
    return { status: sponsorship.status, sponsorship };
  },
};
