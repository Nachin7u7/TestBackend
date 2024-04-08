import { IUserModel } from "../entities/IUserEntity";

export interface UserRepository {
  createUser(userData: IUserModel): Promise<IUserModel>;
  findUserByEmail(email: string): Promise<IUserModel | null>;
  findUserByUsernameOrEmail(username: string, email: string): Promise<IUserModel | null>;
  updateUserConfirmation(email: string, isConfirmed: boolean): Promise<IUserModel | null>;
  deleteUserIfUnconfirmed(email: string): Promise<{ deletedCount?: number }>;
  findUsersBySolvedProblems(): Promise<IUserModel[]>;
  findUserById(userId: string): Promise<IUserModel | null>;
}

