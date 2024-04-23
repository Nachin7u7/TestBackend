import { Document } from 'mongoose';

export interface ICounterEntity extends Document {
  _id?: any;
  seq: number;
}
