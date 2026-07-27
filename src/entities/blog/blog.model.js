import mongoose from 'mongoose';

export const BLOG_STATUS = ['draft', 'published'];

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Blog body is required'],
      trim: true,
    },
    coverPhoto: {
      type: String,
      trim: true,
      default: '',
    },
    author: {
      type: String,
      trim: true,
      default: 'Admin',
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: {
        values: BLOG_STATUS,
        message: '{VALUE} is not a valid blog status',
      },
      default: 'published',
      lowercase: true,
      trim: true,
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Blog', blogSchema);
