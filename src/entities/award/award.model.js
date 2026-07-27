import mongoose from 'mongoose';

const awardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Award title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Award description is required'],
      trim: true,
    },
    coverPhoto: {
      type: String,
      trim: true,
      default: '',
    },
    year: {
      type: String,
      trim: true,
      default: '',
    },
    issuer: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Award', awardSchema);
