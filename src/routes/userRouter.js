const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateRegisterInput = require('../middlewares/validateRegisterInput'); // Asumiendo que tienes este middleware
const validateLoginInput = require('../middlewares/verifyLogin');


router.post('/register', validateRegisterInput, userController.register);
router.get('/verify/:token', userController.verifyEmail);
router.post('/login', validateLoginInput, userController.login);
router.get('/logout', userController.logout);
router.get('/isLoggedIn', userController.checkAuthentication);


module.exports = router;
