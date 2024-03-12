import express from 'express';
const userRouter = express.Router();

import { userController } from '../controllers';
import {
  validateRegisterInput,
  validateLoginInput,
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

export default userRouter;
