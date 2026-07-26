import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, trim: true },
    donorEmail: { type: String, trim: true, lowercase: true },

    amount: { type: Number, required: true }, // major units, e.g. 25.00
    currency: { type: String, default: 'usd' },

    checkoutSessionId: { type: String, index: true },
    paymentIntentId: { type: String, index: true },

    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'expired'],
      default: 'pending',
    },

    message: { type: String, trim: true },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model('Donation', donationSchema);
