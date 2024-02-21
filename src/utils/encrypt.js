const bcrypt = require('bcryptjs');

/**
 * Hashes a password using bcrypt.
 * @param {string} password The password to hash.
 * @return {Promise<string>} The hashed password.
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

module.exports = { hashPassword };
