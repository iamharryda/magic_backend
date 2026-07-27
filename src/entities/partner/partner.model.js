import mongoose from 'mongoose';

export const PARTNER_STATUS = ['applied', 'active_partner', 'inactive', 'rejected'];

const partnerSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    logo: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: PARTNER_STATUS,
        message: '{VALUE} is not a valid partner status',
      },
      default: 'applied',
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Partner', partnerSchema);
