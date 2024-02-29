const userService = require('../services/userService');
const { HTTP_STATUS } = require('../constants');
const { buildLogger } = require('../plugin');
const { jwtUtils } = require('../utils');

const logger = buildLogger('userController');

const globalLeaderboard = async (req, res) => {
  try {
    logger.log('Fetching global leaderboard');
    const leaderboard = await userService.getUsersSortedBySolvedProblems();
    logger.log('Global leaderboard fetched successfully');
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      leaderboard: leaderboard,
    });
  } catch (err) {
    logger.error('Error fetching global leaderboard:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again.',
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    logger.log('Registering new user:', { username, email });
    await userService.registerUser({ username, email, password });
    logger.log('User registered successfully');
    res.status(HTTP_STATUS.CREATED).json({
      message: 'Your account has been created successfully.',
    });
  } catch (error) {
    logger.error('Error registering user:', error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    logger.log('Registering new admin user:', { username, email });
    await userService.registerAdminUser({ username, email, password });
    logger.log('Admin user registered successfully');
    res.status(HTTP_STATUS.CREATED).json({
      message: 'A new ADMIN account has been created successfully.',
    });
  } catch (error) {
    logger.error('Error registering admin user:', error);
    res.status(HTTP_STATUS.CONFLICT).json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    logger.log('Verifying email with token:', token);
    const verifcationResult = await userService.verifyEmail(token);
    logger.log('Email verified successfully');
    res
      .status(HTTP_STATUS.OK)
      .json({ message: 'Email verified successfully. You can now login.' });
  } catch (error) {
    logger.error('Error verifying email:', error);
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: 'Failed to verify email. Invalid or expired token.' });
  }
};

const login = (req, res) => {
  const { user } = req;
  logger.log('User logged in successfully:', { user: user });
  const token = jwtUtils.generateToken(user);
  const refreshToken = jwtUtils.generateRefreshToken(user);
  res.status(HTTP_STATUS.OK).json({
    message: 'Logged in successfully',
    userCreds: {
      id: user._id,
      token,
      refreshToken,
    },
  });
};

const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      logger.error('Error logging out:', err);
      return next(err);
    }
    logger.log('User logged out successfully');
    res.status(HTTP_STATUS.OK).json({ message: 'Successfully logged out.' });
  });
};

const checkAuthentication = (req, res) => {
  if (req.isAuthenticated()) {
    logger.log('User is authenticated:', { user: req.user });
    res.status(HTTP_STATUS.OK).json({
      isAuthenticated: true,
      user: req.user,
    });
  } else {
    logger.log('User is not authenticated', { user: req.user });
    res.status(HTTP_STATUS.OK).json({ isAuthenticated: false });
  }
};

const userController = {
  globalLeaderboard,
  register,
  registerAdmin,
  verifyEmail,
  login,
  logout,
  checkAuthentication,
};

module.exports = userController;
