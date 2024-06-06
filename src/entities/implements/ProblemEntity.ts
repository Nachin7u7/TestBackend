import mongoose, { Schema } from 'mongoose';
import SemiProblemSchema from './SemiProblemEntity';
import { IProblemModel } from '../../models/IProblemModel';
import { IProblemEntity } from '../IProblemEntity';

const ProblemSchema: Schema<IProblemEntity> = new mongoose.Schema({
  _id: {
    type: Number,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  problemName: {
    type: String,
    required: true,
    unique: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  saved: SemiProblemSchema,
  published: SemiProblemSchema,
  submissions: [{
    username: String,
    memory: Number,
    time: Number,
  }],
  solvedCount: {
    type: Number,
    default: 0,
  },
  totalSubmissions: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Problem = mongoose.model<IProblemModel>('Problem', ProblemSchema);

export default Problem;
