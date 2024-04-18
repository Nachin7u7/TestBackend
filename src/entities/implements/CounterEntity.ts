import mongoose, { Schema } from 'mongoose';
import { ICounterEntity } from '../ICounterEntity';
import { ICounterModel } from '../../models/ICounterModel';

const CounterSchema: Schema<ICounterEntity> = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1 },
});

const Counter = mongoose.model<ICounterModel>('Counter', CounterSchema);

export default Counter;
