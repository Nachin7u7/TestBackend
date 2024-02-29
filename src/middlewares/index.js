const validateRegisterInput = require('./validateRegisterInput'); // Asumiendo que tienes este middleware
const validateLoginInput = require('./verifyLogin');
const verifyPermissions = require('./verifyPermissions');
const userAuth = require('./userAuth')
const adminMatchCredentials = require('./adminMatchCredentials')

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  verifyPermissions,
  userAuth,
  adminMatchCredentials
};
