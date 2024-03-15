import mongoose, { Document, Schema } from 'mongoose';

interface IUserModel extends Document {
  email: string;
  username: string;
  password?: string;
  isConfirmed: boolean;
  userType: string;
  avatarUrl: string;
  stats: {
    solved: number[];
    unsolved: number[];
    solvedCount: number;
  };
}

const userSchema: Schema<IUserModel> = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  userType: {
    type: String,
    default: "normal",
  },
  avatarUrl: {
    type: String,
    default: "",
  },
  stats: {
    solved: [Number],
    unsolved: [Number],
    solvedCount: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
});

// Creación del modelo.
const User = mongoose.model<IUserModel>('User', userSchema);

export default User;
