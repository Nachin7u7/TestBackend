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

/**
 * Hashes a password using bcrypt.
 * @param {string} password The password to hash.
 * @param {string} hashedPassword The hashed password .
 * @return {boolean} The veredict fo comparing passwords.
 */
const comparePasswords = (password, hashedPassword) => {
  const veredict = bcrypt.compareSync(password, hashedPassword);
  return veredict;
};

module.exports = { hashPassword, comparePasswords };
