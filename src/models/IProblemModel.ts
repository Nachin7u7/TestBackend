import { Document } from 'mongoose';
import { IProblemEntity } from '../entities/IProblemEntity';

export interface IProblemModel extends IProblemEntity, Document {
}