import { IUserEntity } from "../entities/IUserEntity";

export interface UserRepository {
  createUser(userData: IUserEntity): Promise<IUserEntity>;
  findUserByEmail(email: string): Promise<IUserEntity | null>;
  findUserByUsernameOrEmail(username: string, email: string): Promise<IUserEntity | null>;
  updateUserConfirmation(email: string, isConfirmed: boolean): Promise<IUserEntity | null>;
  deleteUserIfUnconfirmed(email: string): Promise<{ deletedCount?: number }>;
  findUsersBySolvedProblems(): Promise<IUserEntity[]>;
  findUserById(userId: string): Promise<IUserEntity | null>;
}

