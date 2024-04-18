import { Document } from 'mongoose';

export interface IConfigEntity extends Document {
  timelimit: number;
  memorylimit: number;
  difficulty: {
    value: number;
    label: string;
  };
  tags: string[];
}