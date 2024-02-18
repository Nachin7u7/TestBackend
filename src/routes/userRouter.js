const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validateRegisterInput = require("../middlewares/validateRegisterInput"); // Asumiendo que tienes este middleware
const validateLoginInput = require("../middlewares/verifyLogin");
const passport = require("passport");

//! -------- NORMAL USERS ROUTES --------

router.post("/register", validateRegisterInput, userController.register);

//! -------- ADMIN USERS ROUTES --------

// TODO: Add middleware role verification
router.post(
  "/create-admin",
  validateRegisterInput,
  userController.registerAdmin
);

router.get("/verify/:token", userController.verifyEmail);

router.post(
  "/login",
  validateLoginInput,
  passport.authenticate("local", { session: true }),
  userController.login
);

router.get("/logout", userController.logout);
router.get("/isLoggedIn", userController.checkAuthentication);

module.exports = router;
