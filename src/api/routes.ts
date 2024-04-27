import express from 'express';
import { problemRouter} from '../routes';
import { AuthController } from '../controllers/authController';
import userRouter from '../routes/userRouter';
import { AuthService } from '../services/authService';
import { UserRepositoryImpl } from '../repositories/implements/userRepositoryImpl';
import { ProblemController } from '../controllers/problemController';

const router = express.Router();

const problemController = new ProblemController();
const userRepository = new UserRepositoryImpl()
const authService = new AuthService(userRepository)
const authController = new AuthController(authService)

router.use('/users', userRouter);
router.use('/problem', problemController.router);
router.use('/auth', authController.router)

export default router;