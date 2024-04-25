import { IUserEntity } from "../../entities/IUserEntity";
import User from "../../entities/implements/UserEntity";
import { buildLogger } from '../../plugin';
import { UserRepository } from "../userRepository";

export class UserRepositoryImpl implements UserRepository {

  private logger = buildLogger('userRepository');

  async createUser(userData: IUserEntity): Promise<IUserEntity> {
    this.logger.log('Attempting to save a new user.');
    try {
      const user = new User(userData);
      const savedUser = await user.save();
      this.logger.log('Successfully created a new user.', {
        userId: savedUser._id
      });
      return savedUser;
    } catch (error: any) {
      this.logger.error('Error while creating a new user.', {
        error: error.message
      });
      throw new Error('Failed to create a new user: ' + error.message);
    }
  }

  async findUserByEmail(email: string): Promise<IUserEntity | null> {
    this.logger.log('Attempting to find a user by email in database.');
    try {
      const user = await User.findOne({ email });
      this.logger.log('Successfully found user by email.', {
        email: email
      });
      return user;
    } catch (error: any) {
      this.logger.error('Error while finding user by email.', {
        error: error.message,
        email: email
      });
      throw new Error('Failed to find user by email: ' + error.message);
    }
  }

  async findUserByUsernameOrEmail(username: string, email: string): Promise<IUserEntity | null> {
    this.logger.log('Attempting to find a user by username or email in database.');
    try {
      const user = await User.findOne({
        $or: [{ username }, { email }],
      });
      this.logger.log('Successfully found user by username or email.', {
        username: username,
        email: email
      });
      return user;
    } catch (error: any) {
      this.logger.error('Error while finding user by username or email.', {
        error: error.message,
        username: username,
        email: email
      });
      throw new Error('Failed to find user by username or email: ' + error.message);
    }
  }
  async updateUserConfirmation(email: string, isConfirmed: boolean): Promise<IUserEntity | null> {
    this.logger.log('Attempting to update a user confirmation in database.');
    try {
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { $set: { isConfirmed } },
        { new: true }
      );
      this.logger.log('Successfully updated user confirmation.', {
        email: email,
        isConfirmed: isConfirmed
      });
      return updatedUser;
    } catch (error: any) {
      this.logger.error('Error while updating user confirmation.', {
        error: error.message,
        email: email,
        isConfirmed: isConfirmed
      });
      throw new Error('Failed to update user confirmation: ' + error.message);
    }
  }
  async deleteUserIfUnconfirmed(email: string): Promise<{ deletedCount?: number | undefined; }> {
    this.logger.log('Attempting to delete a user by email and unconfirmation status in the database.');
    try {
      const deletedUser = await User.deleteOne({ email, isConfirmed: false });
      this.logger.log('Successfully deleted unconfirmed user.', {
        email: email
      });
      return deletedUser;
    } catch (error: any) {
      this.logger.error('Error while deleting unconfirmed user.', {
        error: error.message,
        email: email
      });
      throw new Error('Failed to delete unconfirmed user: ' + error.message);
    }
  }
  async findUsersBySolvedProblems(): Promise<IUserEntity[]> {
    this.logger.log('Attempting to find users sorted by solved problems.');
    try {
      const users = await User.find(
        {},
        {
          _id: 0,
          username: 1,
          "stats.solvedCount": 1,
        }
      ).sort({ "stats.solvedCount": -1 });
      this.logger.log('Successfully found users sorted by solved problems.');
      return users;
    } catch (error: any) {
      this.logger.error('Error while finding users sorted by solved problems.', {
        error: error.message
      });
      throw new Error('Failed to find users sorted by solved problems: ' + error.message);
    }
  }
  async findUserById(userId: string): Promise<IUserEntity | null> {
    this.logger.log(`Attempting to find user by ID: ${userId}`);
    try {
      const user = await User.findById(userId);
      if (user) {
        this.logger.log(`Successfully found user by ID: ${userId}`);
      } else {
        this.logger.log(`No user found with ID: ${userId}`);
      }
      return user;
    } catch (error: any) {
      this.logger.error(`Error finding user by ID: ${userId}`, { error: error.message });
      throw error;
    }
  }
}