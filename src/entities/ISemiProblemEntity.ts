import { ITestCaseEntity } from './ITestCaseEntity';
import { IConfigEntity } from './IConfigEntity';

export interface ISemiProblemEntity {
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  testcases: ITestCaseEntity[];
  checkerCode: string;
  explanation: string;
  config: IConfigEntity;
}