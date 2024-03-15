import mongoose, { Document, Schema } from 'mongoose';

interface ITestCase extends Document {
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

interface IConfig extends Document {
  timelimit: number;
  memorylimit: number;
  difficulty: {
    value: number;
    label: string;
  };
  tags: string[];
}

interface ISemiProblem extends Document {
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  testcases: ITestCase[];
  checkerCode: string;
  explanation: string;
  config: IConfig;
}

interface IProblemModel extends Document {
  problemId: number;
  author: string;
  problemName: string;
  isPublished: boolean;
  saved: ISemiProblem;
  published: ISemiProblem;
  submissions: {
    username: string;
    memory: number;
    time: number;
  }[];
  solvedCount: number;
  totalSubmissions: number;
}

const testcaseSchema : Schema<ITestCase> = new mongoose.Schema<ITestCase>({
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

const configSchema : Schema<IConfig> = new mongoose.Schema<IConfig>({
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

const semiProblemSchema : Schema<ISemiProblem> = new mongoose.Schema<ISemiProblem>({
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
  testcases: [testcaseSchema],
  checkerCode: {
    type: String,
    default: "",
  },
  explanation: {
    type: String,
    default: "",
  },
  config: configSchema,
});

const problemSchema : Schema<IProblemModel> = new mongoose.Schema<IProblemModel>({
  problemId: {
    type: Number,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  problemName: {
    type: String,
    required: true,
    unique: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  saved: semiProblemSchema,
  published: semiProblemSchema,
  submissions: [{
    username: String,
    memory: Number,
    time: Number,
  }],
  solvedCount: {
    type: Number,
    default: 0,
  },
  totalSubmissions: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Problem = mongoose.model<IProblemModel>('Problem', problemSchema);

export default Problem;
