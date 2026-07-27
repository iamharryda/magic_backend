import mongoose from 'mongoose';

export const CONTACT_STATUS = ['unread', 'read', 'responded'];

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
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
    subject: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: CONTACT_STATUS,
        message: '{VALUE} is not a valid status',
      },
      default: 'unread',
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);
