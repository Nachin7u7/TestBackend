import express from 'express';
import { AuthController } from '../controllers/authController';
import { AuthService } from '../services/authService';
import { UserRepositoryImpl } from '../repositories/implements/userRepositoryImpl';
import { ProblemController } from '../controllers/problemController';
import { SubmissionRepositoryImpl } from '../repositories/implements/submissionRepositoryImpl';
import { ProblemRepositoryImpl } from '../repositories/implements/problemRepositoryImpl';
import { ProblemService } from '../services/problemService';
import { SubmissionService } from '../services/submissionService';
import { SubmissionController } from '../controllers/submissionController';
import { UserController } from '../controllers/userController';
import UserService from '../services/userService';


const router = express.Router();

const userRepository = new UserRepositoryImpl()
const problemRepository = new ProblemRepositoryImpl()
const submissionRepository = new SubmissionRepositoryImpl()


const authService = new AuthService(userRepository)
const problemService = new ProblemService(problemRepository);
const userService = new UserService(userRepository);
const submissionService = new SubmissionService(submissionRepository, problemRepository, userRepository);

const submissionController = new SubmissionController(submissionService, problemService)
const authController = new AuthController(authService, userService)
const problemController = new ProblemController(problemService, userService);
const userController = new UserController(userService);

router.use('/users', userController.router);
router.use('/problem', problemController.router);
router.use('/problem', submissionController.router);
router.use('/auth', authController.router)

export default router;