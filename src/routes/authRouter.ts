import express from 'express';
import { authController } from '../controllers'; // Adjust the path as needed
import { validateRefreshToken } from '../middlewares'; // Adjust the path as needed
import { userController } from '../controllers';
import {
    validateRegisterInput,
    validateLoginInput,
    validateForgotPasswordInput,
    verifyPermissions,
    userAuth,
  } from '../middlewares';

const authRouter = express.Router();


authRouter.post('/login', validateLoginInput, userController.login);
authRouter.get('/logout', userController.logout);
authRouter.get('/isLoggedIn', userAuth, userController.checkAuthentication);
authRouter.post('/forgot-password', validateForgotPasswordInput, userController.forgotPassword);
authRouter.post('/reset-password/:token', userController.resetPassword);
authRouter.get('/verify/:token', userController.verifyEmail);
authRouter.post('/refresh-token', validateRefreshToken, authController.refreshToken);

export default authRouter;
