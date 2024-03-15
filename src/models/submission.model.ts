import mongoose, { Document, Schema } from 'mongoose';

interface ISubmissionModel extends Document {
  username: string;
  problemId: number;
  code: string;
  language: string;
  verdict: string;
  time: number;
  memory: number;
}

const submissionSchema : Schema<ISubmissionModel> = new mongoose.Schema<ISubmissionModel>({
  username: {
    type: String,
    required: true,
  },
  problemId: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  verdict: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  memory: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

submissionSchema.index({ username: 1, problemId: 1 }, { unique: false });

const Submission = mongoose.model<ISubmissionModel>('Submission', submissionSchema);

export default Submission;
