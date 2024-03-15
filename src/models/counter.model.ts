import mongoose, { Document, Schema } from 'mongoose';

interface ICounterModel extends Document {
  _id: string;
  seq: number;
}

const CounterSchema : Schema<ICounterModel> = new mongoose.Schema<ICounterModel>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1 },
});

const Counter = mongoose.model<ICounterModel>('Counter', CounterSchema);

export default Counter;
