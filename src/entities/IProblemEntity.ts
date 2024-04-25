import { Document } from 'mongoose';
import { ISemiProblemEntity } from './ISemiProblemEntity';
import { ISubmissionEntity } from './ISubmissionEntity';

export interface IProblemEntity {
  problemId: number;
  author: string;
  problemName: string;
  isPublished: boolean;
  saved: ISemiProblemEntity;
  published: ISemiProblemEntity;
  submissions: ISubmissionEntity[];
  solvedCount: number;
  totalSubmissions: number;
}
