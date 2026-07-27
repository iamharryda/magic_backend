import { stripe, CURRENCY, FRONTEND_URL, toMinorUnits } from '../../core/config/stripe.js';
import Donation from './donation.model.js';
import { sendDonationEmails, sendDonationFailureEmails } from '../../lib/emailTemplates.js';

export const DonationService = {
  /**
   * Create a Checkout Session for a one-time donation + a pending record.
   * Returns the hosted Checkout URL for the frontend to redirect to.
   */
  async createCheckout({ donorName, donorEmail, amount, message, successUrl, returnUrl }) {
    if (!amount || amount <= 0) {
      const e = new Error('A positive amount is required');
      e.statusCode = 400;
      throw e;
    }

    const donation = await Donation.create({
      donorName,
      donorEmail,
      amount,
      currency: CURRENCY,
      message,
      status: 'pending',
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: donorEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            unit_amount: toMinorUnits(amount),
            product_data: { name: 'Donation' },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: { metadata: { donationId: String(donation._id) } },
      metadata: { donationId: String(donation._id) },
      success_url: successUrl || `${FRONTEND_URL}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: returnUrl || `${FRONTEND_URL}/donation/cancel`,
    });

    donation.checkoutSessionId = session.id;
    await donation.save();

    return { donationId: donation._id, url: session.url, sessionId: session.id };
  },

  /**
   * Called after Checkout redirects back with session_id. Asks Stripe for the
   * real payment status (never trust the client) and updates the record.
   */
  async confirm(sessionId) {
    if (!sessionId) {
      const e = new Error('sessionId is required');
      e.statusCode = 400;
      throw e;
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    const paid = session.payment_status === 'paid';
    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id;

    const donationId = session.metadata?.donationId;
    const update = { status: paid ? 'paid' : 'failed', paymentIntentId };

    const previousDonation = donationId
      ? await Donation.findById(donationId)
      : await Donation.findOne({ checkoutSessionId: session.id });

    const donation = donationId
      ? await Donation.findByIdAndUpdate(donationId, update, { new: true })
      : await Donation.findOneAndUpdate({ checkoutSessionId: session.id }, update, { new: true });

    // If status transitioned to paid, send emails to Donor and Admin
    if (paid && previousDonation?.status !== 'paid' && donation) {
      sendDonationEmails({
        donorEmail: donation.donorEmail || session.customer_details?.email,
        donorName: donation.donorName || session.customer_details?.name,
        amount: donation.amount,
        currency: donation.currency || CURRENCY,
        message: donation.message,
      }).catch((err) => console.error('Error sending donation emails:', err));
    } else if (!paid && previousDonation?.status !== 'failed' && donation) {
      sendDonationFailureEmails({
        donorEmail: donation.donorEmail || session.customer_details?.email,
        donorName: donation.donorName || session.customer_details?.name,
        amount: donation.amount,
        currency: donation.currency || CURRENCY,
        errorReason: 'Payment was not completed or cancelled.',
      }).catch((err) => console.error('Error sending donation failure emails:', err));
    }

    return { paid, status: session.payment_status, donation };
  },

  async list({ filter, skip, limit, page }) {
    const total = await Donation.countDocuments(filter);
    const donations = await Donation.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      donations,
      page,
      totalPages: Math.ceil(total / limit),
      total
    };
  },

  /**
   * Sync pending donations with Stripe to catch successful/expired payments
   * that were missed because of missing webhooks or users closing tabs early.
   */
  async syncPendingDonations() {
    const pendingDonations = await Donation.find({ status: 'pending' });
    const results = { total: pendingDonations.length, processed: 0, completed: 0, expired: 0 };

    for (const donation of pendingDonations) {
      if (!donation.checkoutSessionId) continue;
      
      try {
        const session = await stripe.checkout.sessions.retrieve(donation.checkoutSessionId);
        
        // Only act on terminal states
        if (session.status === 'complete' || session.status === 'expired') {
          await this.confirm(donation.checkoutSessionId);
          results.processed++;
          if (session.status === 'complete') results.completed++;
          if (session.status === 'expired') results.expired++;
        }
      } catch (err) {
        console.error(`Failed to sync donation ${donation._id}:`, err.message);
      }
    }
    
    return results;
  }
};
