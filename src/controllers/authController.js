const { buildLogger } = require('../plugin');
const { successHandler } = require('../handlers');
const { verifyRefreshToken } = require('../services/authService');
const { HTTP_STATUS } = require('../constants');

const logger = buildLogger('authController');

const refreshToken = async (req, res) => {
  try {
    logger.log('Refresh Token');
    const { token } = req.body;
    const tokenResponse = await verifyRefreshToken(token);
    return successHandler.sendOkResponse(res, tokenResponse);
  } catch (err) {
    logger.error(`Error getting new Token: ${err}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Unable to retrieve token. Please try again later.',
    });
  }
};

module.exports = {
  refreshToken,
};
