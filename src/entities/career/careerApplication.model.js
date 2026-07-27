import mongoose from 'mongoose';

export const APPLICATION_STATUS = [
  'applied',
  'under_review',
  'shortlisted',
  'rejected',
  'hired',
];

const careerApplicationSchema = new mongoose.Schema(
  {
    careerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Career',
      required: [true, 'Career ID is required'],
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
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
      required: [true, 'Phone number is required'],
      trim: true,
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume URL is required'],
      trim: true,
    },
    coverLetter: {
      type: String,
      trim: true,
      default: '',
    },
    portfolioUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: APPLICATION_STATUS,
        message: '{VALUE} is not a valid application status',
      },
      default: 'applied',
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('CareerApplication', careerApplicationSchema);
