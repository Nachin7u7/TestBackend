import express from 'express';
import { problemRouter} from '../routes';
import { AuthController } from '../controllers/authController';
import userRouter from '../routes/userRouter';
import { AuthService } from '../services/authService';
import { UserRepositoryImpl } from '../repositories/implements/userRepositoryImpl';

const router = express.Router();

const userRepository = new UserRepositoryImpl()
const authService = new AuthService(userRepository)
const authController = new AuthController(authService)

router.use('/users', userRouter);
router.use('/problem', problemRouter);
router.use('/auth', authController.router)

export default router;