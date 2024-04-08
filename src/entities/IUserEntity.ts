import { Document } from 'mongoose';

export interface IUserModel extends Document {
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