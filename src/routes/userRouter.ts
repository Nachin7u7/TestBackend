import express from 'express';
const userRouter = express.Router();

import { userController } from '../controllers';
import {
  validateRegisterInput,
  validateLoginInput,
  validateForgotPasswordInput,
  verifyPermissions,
  userAuth,
} from '../middlewares';

//! -------- NORMAL USERS ROUTES --------
userRouter.post('/register', validateRegisterInput, userController.register);

//! -------- ADMIN USERS ROUTES --------
userRouter.post(
  '/create-admin',
  userAuth,
  verifyPermissions('isAllowedToCreateAdmin'),
  validateRegisterInput,
  userController.registerAdmin
);

userRouter.get('/verify/:token', userController.verifyEmail);

userRouter.post('/login', validateLoginInput, userController.login);

userRouter.get('/logout', userController.logout);
userRouter.get('/isLoggedIn', userAuth, userController.checkAuthentication);
userRouter.post('/forgot-password', validateForgotPasswordInput, userController.forgotPassword);
userRouter.post('/reset-password/:token', userController.resetPassword);

export default userRouter;
