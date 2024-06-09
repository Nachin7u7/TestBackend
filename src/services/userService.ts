
import { utils } from '../utils';
import { buildLogger } from '../plugin';
import { ROLES } from '../constants';
import jwt from 'jsonwebtoken';
import { UserRepositoryImpl } from '../repositories/implements/userRepositoryImpl';
import EmailService from './emailService';
const { generateToken, verifyToken, hashPassword} = utils;
const logger = buildLogger('userService');
const emailService = new EmailService();
class UserService {
  private userRepository: UserRepositoryImpl;

  constructor(userRepository: UserRepositoryImpl) {
    this.userRepository = userRepository;
  }

  async registerUser(userData: any): Promise<any> {
    const { email, username, password } = userData;
    logger.log('Attempting to register user', { email, username });
    try {
      const existingUser: any = await this.userRepository.findUserByEmail(email);
      if (existingUser) {
        logger.error('Registration attempt failed: User with the given email already exists.', { email });
        throw new Error('User with the given email already exists.');
      }

      const hashedPassword: string = await hashPassword(password);
      const user: any = await this.userRepository.createUser({
        email,
        username,
        password: hashedPassword,
        isConfirmed: false,
      });

      const token: string = generateToken(user);
      await emailService.sendVerificationEmail(email, token);

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
  }

  async registerAdminUser(userData: any): Promise<any> {
    const { email, username, password } = userData;
    logger.log('Attempting to register admin user', { email, username });
    try {
      const existingUser: any = await this.userRepository.findUserByEmail(email);
      if (existingUser) {
        logger.error('Registration attempt failed: Admin User with the given email already exists.', { email });
        throw new Error('Admin User with the given email already exists.');
      }

      const hashedPassword: string = await hashPassword(password);
      const user: any = await this.userRepository.createUser({
        email,
        username,
        password: hashedPassword,
        isConfirmed: false,
        userType: ROLES.ADMIN,
      });

      const token: string = generateToken(user);
      await emailService.sendVerificationEmail(email, token);

      logger.log('Admin User registered and verification email sent successfully', { email, userId: user.id });
      return user;
    } catch (error: any) {
      logger.error('Registration attempt failed due to an error.', {
        error: error.message,
        email,
        username,
      });
      throw new Error('Registration attempt failed');
    }
  }

  async checkTokenToMail(token: string): Promise<any> {
    try {
      const decoded: any = await verifyToken(token);
      logger.log('Token verification successful', { email: decoded.email });
      const updateResult: any = await this.userRepository.updateUserConfirmation(decoded.email, true);
      logger.log('User email verification status updated successfully', { email: decoded.email });
      return updateResult;
    } catch (error: any) {
      if (error instanceof jwt.TokenExpiredError) {
        logger.error('Email verification failed - Token expired', { token });
        throw new Error('Verification link expired. Please request a new verification email.');
      } else {
        logger.error('Email verification failed', {
          error: error.message,
          token,
        });
        throw new Error('Verification failed. Invalid or expired token.');
      }
    }
  }

  async getUsersSortedBySolvedProblems(): Promise<any> {
    try {
      const leaderboard: any = await this.userRepository.findUsersBySolvedProblems();
      logger.log('Successfully retrieved users sorted by solved problems.');
      return leaderboard;
    } catch (err: any) {
      logger.error('Failed to retrieve users sorted by solved problems:', {
        error: err.message,
      });
      throw new Error('Failed to retrieve the leaderboard. Please try again later.');
    }
  }
}

export default UserService;