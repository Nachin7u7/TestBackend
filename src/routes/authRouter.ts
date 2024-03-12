import express from 'express';
import { authController } from '../controllers'; // Adjust the path as needed
import { validateRefreshToken } from '../middlewares'; // Adjust the path as needed

const authRouter = express.Router();

authRouter.post('/refresh-token', validateRefreshToken, authController.refreshToken);

export default authRouter;
