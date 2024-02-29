const { buildLogger } = require('../plugin');
const { successHandler } = require('../handlers');
const logger = buildLogger('authController');

const refreshToken = async (req, res) => {
  try {
    logger.log('Refresh Token');
    return successHandler.sendOkResponse(res, { token: 'true' });
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
