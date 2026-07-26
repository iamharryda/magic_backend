import mongoose from 'mongoose';

const sponsorshipSchema = new mongoose.Schema(
  {
    sponsorName: { type: String, trim: true },
    sponsorEmail: { type: String, trim: true, lowercase: true, required: true },

    childId: { type: String, index: true },

    amount: { type: Number, required: true }, // monthly amount in major units
    currency: { type: String, default: 'usd' },
    interval: { type: String, enum: ['month', 'year'], default: 'month' },

    stripeCustomerId: { type: String, index: true },
    stripeSubscriptionId: { type: String, index: true },
    defaultPaymentMethodId: { type: String },
    checkoutSessionId: { type: String, index: true },

    status: {
      type: String,
      enum: ['incomplete', 'active', 'past_due', 'canceled', 'unpaid', 'paused'],
      default: 'incomplete',
    },

    lastPaymentAt: { type: Date },
    nextBillingDate: { type: Date, index: true },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model('Sponsorship', sponsorshipSchema);
