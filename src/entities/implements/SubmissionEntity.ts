import mongoose, { Schema } from 'mongoose';
import { ISubmissionEntity } from '../ISubmissionEntity';
import { ISubmissionModel } from '../../models/ISubmissionModel';

const SubmissionSchema: Schema<ISubmissionEntity> = new mongoose.Schema({
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

SubmissionSchema.index({ username: 1, problemId: 1 }, { unique: false });

const Submission = mongoose.model<ISubmissionModel>('Submission', SubmissionSchema);

export default Submission;
