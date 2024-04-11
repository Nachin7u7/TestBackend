import express from 'express';
const userRouter = express.Router();

import { userController } from '../controllers';
import {
  validateRegisterInput,
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

export default userRouter;
