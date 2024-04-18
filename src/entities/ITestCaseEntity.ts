import { Document } from 'mongoose';

export interface ITestCaseEntity extends Document {
  input: {
    url: string;
    fileName: string;
  };
  output: {
    url: string;
    fileName: string;
  };
  isSample: boolean;
}