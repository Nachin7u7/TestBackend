import { Document } from 'mongoose';
import { IUserEntity } from '../entities/IUserEntity';

export interface IUserModel extends IUserEntity, Document {
}