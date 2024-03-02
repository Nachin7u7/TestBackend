const userRepository = require('../repositories/userRepository');
const { sendVerificationEmail } = require('./emailService');
const { encrypt, jwtUtils } = require('../utils');
const { buildLogger } = require('../plugin');
const { ROLES } = require('../constants');

const logger = buildLogger('userService');

const registerUser = async (userData) => {
  const { email, username, password } = userData;
  logger.log('Attempting to register user', { email, username });

  try {
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      logger.error(
        'Registration attempt failed: User with the given email already exists.',
        { email }
      );
      throw new Error('User with the given email already exists.');
    }

    const hashedPassword = await encrypt.hashPassword(password);

    const user = await userRepository.createUser({
      email,
      username,
      password: hashedPassword,
      isConfirmed: false,
    });

    const token = jwtUtils.generateToken(user);
    await sendVerificationEmail(email, token);

    logger.log('User registered and verification email sent successfully', {
      email,
      userId: user.id,
    });

    return user;
  } catch (error) {
    console.log(error);
    logger.error('Registration attempt failed due to an error.', {
      error: error.message,
      email,
      username,
    });
    throw new Error('Registration attempt failed');
  }
};

const registerAdminUser = async (userData) => {
  const { email, username, password } = userData;
  logger.log('Attempting to register admin user', { email, username });

  try {
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      logger.error(
        'Registration attempt failed: Admin User with the given email already exists.',
        { email }
      );
      throw new Error('Admin User with the given email already exists.');
    }

    const hashedPassword = await encrypt.hashPassword(password);

    const user = await userRepository.createUser({
      email,
      username,
      password,
      isConfirmed: false,
      userType: ROLES.ADMIN,
    });

    const token = jwtUtils.generateToken(user);
    await sendVerificationEmail(email, token);

    logger.log(
      'Admin User registered and verification email sent successfully',
      {
        email,
        userId: user.id,
      }
    );
    return user;
  } catch (error) {
    logger.error('Registration attempt failed due to an error.', {
      error: error.message,
      email,
      username,
    });
    throw new Error('Registration attempt failed');
  }
};

const verifyEmail = async (token) => {
  try {
    const decoded = await jwtUtils.verifyToken(token);
    logger.log('Token verification successful', { email: decoded.email });
    const updateResult = await userRepository.updateUserConfirmation(
      decoded.email,
      true
    );
    logger.log('User email verification status updated successfully', {
      email: decoded.email,
    });
    return updateResult;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.error('Email verification failed - Token expired', { token });
      throw new Error(
        'Verification link expired. Please request a new verification email.'
      );
    } else {
      logger.error('Email verification failed', {
        error: error.message,
        token,
      });
      throw new Error('Verification failed. Invalid or expired token.');
    }
  }
};

const getUsersSortedBySolvedProblems = async () => {
  try {
    const leaderboard = await userRepository.findUsersBySolvedProblems();
    logger.log('Successfully retrieved users sorted by solved problems.');
    return leaderboard;
  } catch (err) {
    logger.error('Failed to retrieve users sorted by solved problems:', err);
    throw new Error(
      'Failed to retrieve the leaderboard. Please try again later.'
    );
  }
};

const authenticateUser = async (username, password) => {
  const user = await userRepository.findUserByUsernameOrEmail(
    username,
    username
  );

  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await encrypt.comparePasswords(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const accessToken = jwtUtils.generateAccessToken(user);
  const refreshToken = jwtUtils.generateRefreshToken(user);

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

const userService = {
  getUsersSortedBySolvedProblems,
  registerUser,
  verifyEmail,
  registerAdminUser,
  authenticateUser,
};

module.exports = userService;
