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

    const hashedPassword = await encrypt.hashedPassword(password);

    const user = await userRepository.createUser({
      email,
      username,
      password: hashedPassword,
      isConfirmed: false,
    });

    const token = jwtUtils.generateToken(user);
    await sendVerificationEmail(email, token);

    logger.info('User registered and verification email sent successfully', {
      email,
      userId: user.id,
    });
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

const registerAdminUser = async (userData) => {
  const { email, username, password } = userData;

  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error('User with the given email already exists.');
  }

  const user = await userRepository.createUser({
    email,
    username,
    password,
    isConfirmed: false,
    userType: ROLES.ADMIN,
  });

  const token = jwtUtils.generateToken(user);
  await sendVerificationEmail(email, token);

  return user;
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
    return leaderboard;
  } catch (err) {
    throw err;
  }
};

const userService = {
  getUsersSortedBySolvedProblems,
  registerUser,
  verifyEmail,
  registerAdminUser,
};

module.exports = userService;
