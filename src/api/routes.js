const express = require('express');
const router = express.Router();

const { userRouter, problemRouter } = require('../routes');

router.use('/users', userRouter);
router.use('/problem', problemRouter);

const problemCreationRouter = require('../routes/problemCreationRouter');
router.use('/problemCreation', problemCreationRouter);

module.exports = router;
