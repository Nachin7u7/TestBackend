import express from 'express';
import {userRouter, authRouter, problemRouter} from '../routes';

const router = express.Router();

router.use('/users', userRouter);
router.use('/problem', problemRouter);
router.use('/auth', authRouter);

export default router;
