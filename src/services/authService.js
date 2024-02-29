const { jwtUtils } = require('../utils');

const verifyRefreshToken = async (refreshToken) => {
  try {
    const decoded = await jwtUtils.verifyToken(refreshToken);
    console.log(decoded);
  } catch (error) {
    throw new Error('Error Refresh Token');
  }
};

module.exports = {
  verifyRefreshToken,
};
