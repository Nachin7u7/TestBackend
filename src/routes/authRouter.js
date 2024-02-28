const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const userAuth = require('../middlewares/userAuth');

router.get('/refresh-token', userAuth, authController.refreshToken);

module.exports = router;
