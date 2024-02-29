const jwt = require('jsonwebtoken');
const { config } = require('../config');

/**
 * Generates a JWT for a user.
 * @param {Object} user The user object for whom to generate the token.
 * @returns {String} The generated JWT token.
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, username: user.username, type: user.userType },
    config.jwt.tokenSecret,
    { expiresIn: config.jwt.tokenExpireIn }
  );
};



/**
 * Generates a JWT for a user.
 * @param {Object} user The user object for whom to generate the token.
 * @returns {String} The generated JWT token.
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, username: user.username, type: user.userType },
    config.jwt.tokenSecret,
    { expiresIn: config.jwt.tokenRefreshExpireIn }
  );
};


/**
 * Verifies a JWT token and returns the decoded payload if valid.
 * @param {String} token The JWT token to verify.
 * @returns {Promise} A promise that resolves with the decoded token payload if valid, or rejects if not valid.
 */
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.tokenSecret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

module.exports = { generateToken, verifyToken, generateRefreshToken};
