const express = require('express');
const router = express.Router();

// --------------- Routes ---------------
const userRouter = require("../routes/userRouter");
router.use("/users", userRouter);
const problemCreationRouter = require("../routes/problemCreationRouter");
router.use("/problemCreation", problemCreationRouter);
const problemRouter = require("../routes/problemRouter");
router.use("/problem", problemRouter);

module.exports = router;
