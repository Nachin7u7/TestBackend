const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { validateRefreshToken } = require('../middlewares');

router.post(
  '/refresh-token',
  validateRefreshToken,
  authController.refreshToken
);

module.exports = router;
