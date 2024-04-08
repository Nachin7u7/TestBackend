import User from "../../models/user.model";
import { buildLogger } from '../../plugin';

const logger = buildLogger('userRepository');

const createUser = async (userData: any): Promise<any> => {
  logger.log('Attempting to save a new user.');
  try {
    const user: any = new User(userData);
    const savedUser: any = await user.save();
    logger.log('Successfully created a new user.', {
      userId: savedUser._id
    });
    return savedUser;
  } catch (error: any) {
    logger.error('Error while creating a new user.', {
      error: error.message
    });
    throw new Error('Failed to create a new user: ' + error.message);
  }
};

const findUserByEmail = async (email : string): Promise<any> => {
  logger.log('Attempting to find a user by email in database.');
  try {
    const user = await User.findOne({ email });
    logger.log('Successfully found user by email.', {
      email: email
    });
    return user;
  } catch (error: any) {
    logger.error('Error while finding user by email.', {
      error: error.message,
      email: email
    });
    throw new Error('Failed to find user by email: ' + error.message);
  }
};

const findUserByUsernameOrEmail = async (username: string, email: string): Promise<any> => {
  logger.log('Attempting to find a user by username or email in database.');
  try {
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
    logger.log('Successfully found user by username or email.', {
      username: username,
      email: email
    });
    return user;
  } catch (error: any) {
    logger.error('Error while finding user by username or email.', {
      error: error.message,
      username: username,
      email: email
    });
    throw new Error('Failed to find user by username or email: ' + error.message);
  }
};

const updateUserConfirmation = async (email: string, isConfirmed: boolean): Promise<any> => {
  logger.log('Attempting to update a user confirmation in database.');
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { isConfirmed } },
      { new: true }
    );
    logger.log('Successfully updated user confirmation.', {
      email: email,
      isConfirmed: isConfirmed
    });
    return updatedUser;
  } catch (error: any) {
    logger.error('Error while updating user confirmation.', {
      error: error.message,
      email: email,
      isConfirmed: isConfirmed
    });
    throw new Error('Failed to update user confirmation: ' + error.message);
  }
};

const deleteUserIfUnconfirmed = async (email: string): Promise<any> => {
  logger.log('Attempting to delete a user by email and unconfirmation status in the database.');
  try {
    const deletedUser = await User.deleteOne({ email, isConfirmed: false });
    logger.log('Successfully deleted unconfirmed user.', {
      email: email
    });
    return deletedUser;
  } catch (error: any) {
    logger.error('Error while deleting unconfirmed user.', {
      error: error.message,
      email: email
    });
    throw new Error('Failed to delete unconfirmed user: ' + error.message);
  }
};

const findUsersBySolvedProblems = async (): Promise<any> => {
  logger.log('Attempting to find users sorted by solved problems.');
  try {
    const users = await User.find(
      {},
      {
        _id: 0,
        username: 1,
        "stats.solvedCount": 1,
      }
    ).sort({ "stats.solvedCount": -1 });
    logger.log('Successfully found users sorted by solved problems.');
    return users;
  } catch (error: any) {
    logger.error('Error while finding users sorted by solved problems.', {
      error: error.message
    });
    throw new Error('Failed to find users sorted by solved problems: ' + error.message);
  }
};
const findUserById = async (userId: any): Promise<any> => {
  logger.log(`Attempting to find user by ID: ${userId}`);
  try {
    const user = await User.findById(userId);
    if (user) {
      logger.log(`Successfully found user by ID: ${userId}`);
    } else {
      logger.log(`No user found with ID: ${userId}`);
    }
    return user;
  } catch (error: any) {
    logger.error(`Error finding user by ID: ${userId}`, { error: error.message });
    throw error;
  }
};

const userRepository = {
  createUser,
  findUserById,
  findUserByEmail,
  findUserByUsernameOrEmail,
  findUsersBySolvedProblems,
  updateUserConfirmation,
  deleteUserIfUnconfirmed,
};

export default userRepository;
