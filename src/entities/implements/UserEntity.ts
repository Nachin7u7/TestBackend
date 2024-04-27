import mongoose, { Schema } from 'mongoose';
import { IUserEntity } from '../IUserEntity';
import { IUserModel } from '../../models/IUserModel';


const userSchema: Schema<IUserEntity> = new mongoose.Schema({
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

const User = mongoose.model<IUserModel>('User', userSchema);

export default User;
