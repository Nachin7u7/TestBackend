import { UserRepositoryImpl } from './../repositories/implements/userRepositoryImpl';
import { UserRepository } from './../repositories/userRepository';
import { utils } from '../utils';
import { buildLogger } from '../plugin';
import jwt from 'jsonwebtoken';
import { sendForgotPassword } from './emailService';


const { 
  verifyToken,
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  comparePasswords,
} = utils
const logger = buildLogger('authService');



class AuthService {
  private userRepository:UserRepositoryImpl;

  constructor(userRepository:UserRepositoryImpl){
    this.userRepository = userRepository;
  }

  async authenticateUser(username: string, password: string): Promise<any> {
    const user: any = await this.userRepository.findUserByUsernameOrEmail(username, username);
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
  }

  async sendForgotPasswordEmail(email: string): Promise<any> {
    const user: any = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
  
    const token: string = generateToken(user);
    await sendForgotPassword(email, token);
  }

  async resetUserPassword(token: string, password: string): Promise<any> {
    try {
      const decoded: any = await verifyToken(token);
      const hashedPassword: string = await hashPassword(password);
      const user: any = await this.userRepository.findUserByEmail(decoded.email);
      user.password = hashedPassword;
      await user.save();
    } catch (error: any) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error(
          'Password reset link expired. Please request a new password reset email.'
        );
      } else {
        throw new Error('Password reset failed. Invalid or expired token.');
      }
    }
  }
}

const verifyRefreshToken = async (refreshToken: string): Promise<any> => {
  try {
    const decoded = await verifyToken(refreshToken);
    //TODO: getNewToken
    logger.log('Token verification successful', { decoded });
    return decoded;
  } catch (error: any) {
    logger.error('Error verifying refresh token', { error: error.message });
    throw new Error('Error verifying refresh token');
  }
};

export { verifyRefreshToken, AuthService };
