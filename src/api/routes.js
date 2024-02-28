const express = require('express');
const router = express.Router();

const { userRouter, problemRouter, authRouter } = require('../routes');

router.use('/users', userRouter);
router.use('/problem', problemRouter);
router.use('/auth', authRouter);

const problemCreationRouter = require('../routes/problemCreationRouter');
router.use('/problemCreation', problemCreationRouter);

module.exports = router;
