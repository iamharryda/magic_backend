import mongoose from 'mongoose';

export const PROJECT_TAGS = [
  'education',
  'youth',
  'empowerment',
  'health',
  'emergency',
  'climate',
  'research',
  'peace',
];

export const PROJECT_STATUS = ['ongoing', 'completed'];

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Project body is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: PROJECT_STATUS,
        message: '{VALUE} is not a valid status',
      },
      default: 'ongoing',
      lowercase: true,
      trim: true,
    },
    tags: {
      type: [{
        type: String,
        enum: {
          values: PROJECT_TAGS,
          message: '{VALUE} is not a valid project tag',
        },
        lowercase: true,
        trim: true,
      }],
      default: [],
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
