import { stripe, CURRENCY, toMinorUnits } from '../../core/config/stripe.js';
import Sponsorship from './sponsorship.model.js';

const badRequest = (msg) => Object.assign(new Error(msg), { statusCode: 400 });
const notFound = (msg) => Object.assign(new Error(msg), { statusCode: 404 });

/**
 * Sponsor-a-child (2 steps, so the card is authenticated once then charged
 * off-session every month):
 *   1) setup()     -> create/find customer + SetupIntent, return clientSecret.
 *   2) subscribe() -> attach confirmed card as default, create subscription.
 */
export const SponsorshipService = {
  async setup({ sponsorName, sponsorEmail, childId, amount, interval = 'month' }) {
    if (!sponsorEmail) throw badRequest('sponsorEmail is required');
    if (!amount || amount <= 0) throw badRequest('A positive amount is required');

    // Reuse an existing Stripe customer for this email if one exists.
    const existing = await stripe.customers.list({ email: sponsorEmail, limit: 1 });
    const customer = existing.data.length
      ? existing.data[0]
      : await stripe.customers.create({
          email: sponsorEmail,
          name: sponsorName,
          metadata: { role: 'sponsor' },
        });

    // usage: 'off_session' marks the card reusable for future unattended charges.
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      usage: 'off_session',
      payment_method_types: ['card'],
      metadata: { childId: childId || '' },
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

    return {
      sponsorshipId: sponsorship._id,
      customerId: customer.id,
      clientSecret: setupIntent.client_secret, // frontend confirms the card with this
    };
  },

  async subscribe({ sponsorshipId, customerId, paymentMethodId, childId, amount, interval }) {
    if (!customerId || !paymentMethodId) {
      throw badRequest('customerId and paymentMethodId are required');
    }

    // Attach the card (ignore if already attached during SetupIntent) + make it default.
    try {
      await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
    } catch (err) {
      if (err.code !== 'payment_method_already_attached') throw err;
    }
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    const sponsorship = sponsorshipId
      ? await Sponsorship.findById(sponsorshipId)
      : await Sponsorship.findOne({ stripeCustomerId: customerId }).sort({ createdAt: -1 });

    const finalAmount = amount || sponsorship?.amount;
    const finalInterval = interval || sponsorship?.interval || 'month';

    // Inline price_data => sponsor can pick any amount without pre-made Prices.
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price_data: {
            currency: CURRENCY,
            unit_amount: toMinorUnits(finalAmount),
            recurring: { interval: finalInterval },
            product_data: { name: 'Child Sponsorship' },
          },
        },
      ],
      off_session: true,
      payment_behavior: 'error_if_incomplete', // fail fast; result known synchronously
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        sponsorshipId: sponsorship ? String(sponsorship._id) : '',
        childId: childId || sponsorship?.childId || '',
      },
    });

    if (sponsorship) {
      sponsorship.stripeSubscriptionId = subscription.id;
      sponsorship.defaultPaymentMethodId = paymentMethodId;
      sponsorship.amount = finalAmount;
      sponsorship.interval = finalInterval;
      sponsorship.status = subscription.status; // usually 'active'
      await sponsorship.save();
    }

    return {
      subscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
    };
  },

  async cancel(sponsorshipId) {
    const sponsorship = await Sponsorship.findById(sponsorshipId);
    if (!sponsorship) throw notFound('Sponsorship not found');
    if (!sponsorship.stripeSubscriptionId) throw badRequest('No active subscription');

    await stripe.subscriptions.cancel(sponsorship.stripeSubscriptionId);
    sponsorship.status = 'canceled';
    await sponsorship.save();
    return { status: 'canceled' };
  },

  /**
   * On-demand status check (no webhooks). Pulls current state from Stripe and
   * refreshes our record. Call on dashboard load or from a scheduled job to
   * detect failed monthly renewals (past_due / canceled).
   */
  async getStatus(sponsorshipId) {
    const sponsorship = await Sponsorship.findById(sponsorshipId);
    if (!sponsorship) throw notFound('Sponsorship not found');
    if (!sponsorship.stripeSubscriptionId) {
      return { status: sponsorship.status, synced: false };
    }

    const sub = await stripe.subscriptions.retrieve(sponsorship.stripeSubscriptionId);
    sponsorship.status = sub.status;
    await sponsorship.save();

    return { status: sub.status, currentPeriodEnd: sub.current_period_end, synced: true };
  },
};
