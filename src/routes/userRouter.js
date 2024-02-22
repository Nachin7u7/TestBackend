const express = require("express");
const router = express.Router();const userController = require('../controllers/userController');
const {
  validateRegisterInput,
  validateLoginInput,
  verifyPermissions,
  userAuth
} = require('../middlewares'); // Asumiendo que tienes este middleware

const passport = require('passport');

//! -------- NORMAL USERS ROUTES --------

router.post('/register', validateRegisterInput, userController.register);

//! -------- ADMIN USERS ROUTES --------

router.post(
  '/create-admin',
  userAuth,
  verifyPermissions('isAllowedToCreateAdmin'),
  validateRegisterInput,
  userController.registerAdmin
);

router.get('/verify/:token', userController.verifyEmail);

router.post(
  '/login',
  validateLoginInput,
  passport.authenticate('local', { session: false }),
  userController.login
);

module.exports = router;