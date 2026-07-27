import mongoose from 'mongoose';

export const VOLUNTEER_STATUS = ['applied', 'working', 'completed', 'rejected'];

const volunteerSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company/Applicant name is required'],
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
        values: VOLUNTEER_STATUS,
        message: '{VALUE} is not a valid volunteer status',
      },
      default: 'applied',
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Volunteer', volunteerSchema);
