import { Document } from 'mongoose';
import { IUserModel } from '../entities/IUserEntity';

export interface UserModel extends IUserModel, Document {
}