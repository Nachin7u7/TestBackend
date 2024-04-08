import mongoose, { Schema } from 'mongoose';
import { UserModel } from '../../models/UserModel';


const userSchema: Schema<UserModel> = new mongoose.Schema({
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

const User = mongoose.model<UserModel>('User', userSchema);

export default User;
