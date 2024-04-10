import { UserRepository } from './../repositories/userRepository';
import { services } from '../services';
import { HTTP_STATUS } from '../constants';
import { buildLogger } from '../plugin';
import { AuthService } from '../services/authService';
import * as successHandler from '../handlers/successHandler'; // Adjust based on your actual file structure
import { UserRepositoryImpl } from '../repositories/implements/userRepositoryImpl';

const {
  getUsersSortedBySolvedProblems,
  registerUser,
  registerAdminUser,
  checkTokenToMail,
} = services;
const userRepository = new UserRepositoryImpl(); 
const authService = new AuthService(userRepository);
const logger = buildLogger('userController');

const globalLeaderboard = async (req: any, res: any): Promise<any> => {
  try {
    logger.log('Fetching global leaderboard');
    const leaderboard = await getUsersSortedBySolvedProblems();
    logger.log('Global leaderboard fetched successfully');
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      leaderboard,
    });
  } catch (err: any) {
    logger.error('Error fetching global leaderboard:', { error: err.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error. Please try again.',
    });
  }
};

const register = async (req: any, res: any): Promise<any> => {
  try {
    const { username, email, password } = req.body;
    logger.log('Registering new user:', { username, email });
    await registerUser({ username, email, password });
    logger.log('User registered successfully');
    res.status(HTTP_STATUS.CREATED).json({
      message: 'Your account has been created successfully.',
    });
  } catch (error: any) {
    logger.error('Error registering user:', error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const registerAdmin = async (req: any, res: any): Promise<any> => {
  try {
    const { username, email, password } = req.body;
    logger.log('Registering new admin user:', { username, email });
    await registerAdminUser({ username, email, password });
    logger.log('Admin user registered successfully');
    res.status(HTTP_STATUS.CREATED).json({
      message: 'A new ADMIN account has been created successfully.',
    });
  } catch (error: any) {
    logger.error('Error registering admin user:', error);
    res.status(HTTP_STATUS.CONFLICT).json({ message: error.message });
  }
};

const verifyEmail = async (req: any, res: any): Promise<any> => {
  try {
    const { token } = req.params;
    logger.log('Verifying email with token:', token);
    const verifcationResult = await checkTokenToMail(token);
    logger.log('Email verified successfully');
    res
      .status(HTTP_STATUS.OK)
      .json({ message: 'Email verified successfully. You can now login.' });
  } catch (error: any) {
    logger.error('Error verifying email:', error);
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: 'Failed to verify email. Invalid or expired token.' });
  }
};

const login = async (req: any, res: any): Promise<any> => {
  try {
    const { username, password } = req.body;
    logger.log('Attempting to log in user:', { user: username });
    const loginResponseData = await authService.authenticateUser(username, password);

    successHandler.sendOkResponse(
      res,
      loginResponseData,
      'Logged in successfully'
    );
  } catch (error: any) {
    logger.error('Login error', { error: error.message });
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: error.message });
  }
};

const logout = (req: any, res: any) => {
  logger.log('User logged out successfully');
  res.status(HTTP_STATUS.OK).json({ message: 'Successfully logged out.' });
};

const checkAuthentication = (req: any, res: any) => {
  const { user } = req;
  if (user) {
    logger.log('User is authenticated:', { user: req.user });
    res.status(HTTP_STATUS.OK).json({
      isAuthenticated: true,
      user: user,
    });
  } else {
    logger.log('User is not authenticated');
    res.status(HTTP_STATUS.OK).json({ isAuthenticated: false });
  }
};

const forgotPassword = async (req: any, res: any) => {
  try {
    const { email } = req.body;
    logger.log('Forgot password request for email:', email);
    await authService.sendForgotPasswordEmail(email);
    logger.log('Forgot password email sent successfully');
    successHandler.sendOkResponse(
      res,
      null,
      'Forgot password email sent successfully'
    );
  } catch (error: any) {
    logger.error('Error sending forgot password email:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to send email. Please try again.',
    });
  }
};

const resetPassword = async (req: any, res: any) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    logger.log('Resetting password for token:', token);
    await authService.resetUserPassword(token, password);
    logger.log('Password reset successfully');
    successHandler.sendOkResponse(res, null, 'Password reset successfully');
  } catch (error: any) {
    logger.error('Error resetting password:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to reset password. Please try again.',
    });
  }
};

export {
  globalLeaderboard,
  register,
  registerAdmin,
  verifyEmail,
  login,
  logout,
  checkAuthentication,
  forgotPassword,
  resetPassword,
};
