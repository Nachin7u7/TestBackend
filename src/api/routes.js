const express = require('express');
const router = express.Router();

const { userRouter, problemRouter } = require('../routes');

router.use('/users', userRouter);
router.use('/problem', problemRouter);

module.exports = router;
