const { jwtUtils } = require('../utils');
const { buildLogger } = require('../plugin');

const logger = buildLogger('authService');

const verifyRefreshToken = async (refreshToken) => {
  try {
    const decoded = await jwtUtils.verifyToken(refreshToken);
    //TODO: getNewToken
    logger.log('Token verification successful', { decoded });
    return decoded;
  } catch (error) {
    logger.error('Error verifying refresh token', { error: error.message });
    throw new Error('Error verifying refresh token');
  }
};

module.exports = {
  verifyRefreshToken,
};
