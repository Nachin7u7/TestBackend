import mongoose, { Schema } from 'mongoose';
import TestCaseSchema from './TestCaseEntity';
import ConfigSchema from './ConfigEntity';
import { ISemiProblemEntity } from '../ISemiProblemEntity';

const SemiProblemSchema: Schema<ISemiProblemEntity> = new mongoose.Schema({
  statement: {
    type: String,
    default: "",
  },
  inputFormat: {
    type: String,
    default: "",
  },
  outputFormat: {
    type: String,
    default: "",
  },
  constraints: {
    type: String,
    default: "",
  },
  testcases: [TestCaseSchema],
  checkerCode: {
    type: String,
    default: "",
  },
  explanation: {
    type: String,
    default: "",
  },
  config: ConfigSchema,
});

export default SemiProblemSchema;
