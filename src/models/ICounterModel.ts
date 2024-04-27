import { Document } from 'mongoose';
import { ICounterEntity } from '../entities/ICounterEntity';

export interface ICounterModel extends ICounterEntity, Document {
}