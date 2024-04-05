import { repositories } from '../repositories';
import { sendVerificationEmail, sendForgotPassword } from './emailService';
import { utils } from '../utils';
import { buildLogger } from '../plugin';
import { ROLES } from '../constants';
import jwt from 'jsonwebtoken';

const {
  findUserByEmail,
  createUser,
  updateUserConfirmation,
  findUsersBySolvedProblems,
  findUserByUsernameOrEmail,
} = repositories;
const {
  generateToken,
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  comparePasswords,
} = utils;
const logger = buildLogger('userService');

const registerUser = async (userData: any): Promise<any> => {
  const { email, username, password } = userData;
  logger.log('Attempting to register user', { email, username });
  try {
    const existingUser: any = await findUserByEmail(email);
    if (existingUser) {
      logger.error(
        'Registration attempt failed: User with the given email already exists.',
        { email }
      );
      throw new Error('User with the given email already exists.');
    }

    const hashedPassword: string = await hashPassword(password);
    const user: any = await createUser({
      email,
      username,
      password: hashedPassword,
      isConfirmed: false,
    });

    const token: string = generateToken(user);
    await sendVerificationEmail(email, token);

    logger.log('User registered and verification email sent successfully', {
      email,
      userId: user.id,
    });
    return user;
  } catch (error: any) {
    logger.error('Registration attempt failed due to an error.', {
      error: error.message,
      email,
      username,
    });
    throw new Error('Registration attempt failed');
  }
};

const registerAdminUser = async (userData: any): Promise<any> => {
  const { email, username, password } = userData;
  logger.log('Attempting to register admin user', { email, username });
  try {
    const existingUser: any = await findUserByEmail(email);
    if (existingUser) {
      logger.error('Registration attempt failed: Admin User with the given email already exists.', { email });
      throw new Error('Admin User with the given email already exists.');
    }

    const hashedPassword: string = await hashPassword(password);
    const user: any = await createUser({
      email,
      username,
      password: hashedPassword,
      isConfirmed: false,
      userType: ROLES.ADMIN,
    });

    const token: string = generateToken(user);
    await sendVerificationEmail(email, token);

    logger.log('Admin User registered and verification email sent successfully', { email, userId: user.id });
    return user;
  } catch (error: any) {
    logger.error('Registration attempt failed due to an error.', { error: error.message, email, username });
    throw new Error('Registration attempt failed');
  }
};

const checkTokenToMail = async (token: string): Promise<any> => {
  try {
    const decoded: any = await verifyToken(token);
    logger.log('Token verification successful', { email: decoded.email });
    const updateResult: any = await updateUserConfirmation(decoded.email, true);
    logger.log('User email verification status updated successfully', { email: decoded.email });
    return updateResult;
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.error('Email verification failed - Token expired', { token });
      throw new Error('Verification link expired. Please request a new verification email.');
    } else {
      logger.error('Email verification failed', { error: error.message, token });
      throw new Error('Verification failed. Invalid or expired token.');
    }
  }
};

const getUsersSortedBySolvedProblems = async (): Promise<any> => {
  try {
    const leaderboard: any = await findUsersBySolvedProblems();
    logger.log('Successfully retrieved users sorted by solved problems.');
    return leaderboard;
  } catch (err: any) {
    logger.error('Failed to retrieve users sorted by solved problems:', { error: err.message });
    throw new Error('Failed to retrieve the leaderboard. Please try again later.');
  }
};

const authenticateUser = async (username: string, password: string): Promise<any> => {
  const user: any = await findUserByUsernameOrEmail(username, username);
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch: boolean = await comparePasswords(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const accessToken: string = generateAccessToken(user);
  const refreshToken: string = generateRefreshToken(user);

  return {
    id: user._id,
    token: accessToken,
    refreshToken: refreshToken,
    username: user.username,
    email: user.email,
    userType: user.userType,
    avatarUrl: user.avatarUrl,
  };
};

const sendForgotPasswordEmail = async (email: string): Promise<any> => {
  const user: any = await findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  const token: string = generateToken(user);
  await sendForgotPassword(email, token);
};

export {
  getUsersSortedBySolvedProblems,
  registerUser,
  checkTokenToMail,
  registerAdminUser,
  authenticateUser,
  sendForgotPasswordEmail,
};
