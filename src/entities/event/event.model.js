import mongoose from 'mongoose';

export const EVENT_STATUS = ['upcoming', 'ongoing', 'completed', 'cancelled'];

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Event body/description is required'],
      trim: true,
    },
    coverPhoto: {
      type: String,
      trim: true,
      default: '',
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    registrationLink: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: EVENT_STATUS,
        message: '{VALUE} is not a valid event status',
      },
      default: 'upcoming',
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
