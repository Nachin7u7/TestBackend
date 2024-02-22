const { jwtUtils } = require('../utils');
const { HTTP_STATUS } = require('../constants');

const userAuth = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await jwtUtils.verifyToken(token);
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Invalid token.',
    });
  }
};

const jwt = require('jsonwebtoken');

module.exports = userAuth;
