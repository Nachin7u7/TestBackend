import { Document } from 'mongoose';
import { ISubmissionEntity } from '../entities/ISubmissionEntity';

export interface ISubmissionModel extends ISubmissionEntity, Document {
}