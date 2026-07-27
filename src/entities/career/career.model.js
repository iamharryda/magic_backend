import mongoose from 'mongoose';

export const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship'];
export const CAREER_STATUS = ['open', 'closed'];

const careerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: 'Remote',
    },
    jobType: {
      type: String,
      enum: {
        values: JOB_TYPES,
        message: '{VALUE} is not a valid job type',
      },
      default: 'full-time',
      lowercase: true,
      trim: true,
    },
    experienceLevel: {
      type: String,
      trim: true,
      default: '',
    },
    salaryRange: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: {
        values: CAREER_STATUS,
        message: '{VALUE} is not a valid status',
      },
      default: 'open',
      lowercase: true,
      trim: true,
    },
    deadline: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Career', careerSchema);
