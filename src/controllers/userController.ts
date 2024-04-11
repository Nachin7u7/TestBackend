
import { services } from '../services';
import { HTTP_STATUS } from '../constants';
import { buildLogger } from '../plugin';
import { AuthService } from '../services/authService';
import { UserRepositoryImpl } from '../repositories/implements/userRepositoryImpl';

const {
  getUsersSortedBySolvedProblems,
  registerUser,
  registerAdminUser
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

export {
  globalLeaderboard,
  register,
  registerAdmin,
};
