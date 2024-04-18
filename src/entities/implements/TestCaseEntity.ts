import mongoose, { Schema } from 'mongoose';
import { ITestCaseEntity } from '../ITestCaseEntity';

const TestCaseSchema: Schema<ITestCaseEntity> = new mongoose.Schema({
  input: {
    url: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
  },
  output: {
    url: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
  },
  isSample: {
    type: Boolean,
    required: true,
  },
});

export default TestCaseSchema;
