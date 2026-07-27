import mongoose from 'mongoose';

const yearbookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Yearbook title is required'],
      trim: true,
    },
    coverPhoto: {
      type: String,
      trim: true,
      default: '',
    },
    pdfUrl: {
      type: String,
      required: [true, 'PDF URL or Google Drive link is required'],
      trim: true,
    },
    year: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Yearbook', yearbookSchema);
