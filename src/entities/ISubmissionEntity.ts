import { Document } from 'mongoose';

export interface ISubmissionEntity extends Document {
  username: string;
  problemId: number;
  code: string;
  language: string;
  verdict: string;
  time: number;
  memory: number;
}
