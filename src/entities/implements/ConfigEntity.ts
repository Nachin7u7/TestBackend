import mongoose, { Schema } from 'mongoose';
import { IConfigEntity } from '../IConfigEntity';

const ConfigSchema: Schema<IConfigEntity> = new mongoose.Schema({
  timelimit: {
    type: Number,
    default: 1000,
  },
  memorylimit: {
    type: Number,
    default: 256,
  },
  difficulty: {
    value: {
      type: Number,
      min: 1,
      max: 3,
      default: 1,
    },
    label: {
      type: String,
      default: "Easy",
    },
  },
  tags: [String],
});

export default ConfigSchema;
