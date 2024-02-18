const userService = require("../services/userService");
const { HTTP_STATUS } = require("../constants");
const { buildLogger } = require('../plugin');

const logger = buildLogger('userController');

const globalLeaderboard = async (req, res) => {
  try {
    const leaderboard = await userService.getUsersSortedBySolvedProblems();
    return res.status(200).json({
      success: true,
      leaderboard: leaderboard,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await userService.registerUser({ username, email, password });
    res.status(201).json({
      message: "Your account has been created successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // TODO: Create Service with the name commented

    // await userService.registerAdminUser({ username, email, password });

    res.status(201).json({
      message: "A new ADMIN account has been created successfully.",
    });
  } catch (error) {
    res.status(409).json({ message: error.message});
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const verifcationResult = await userService.verifyEmail(token);
    res
      .status(HTTP_STATUS.OK)
      .json({ message: "Email verified successfully. You can now login." });
  } catch (error) {
    logger.error('Error verifying email:', error);
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: "Failed to verify email. Invalid or expired token." });
  }
};

const login = (req, res) => {
  res.status(200).json({
    message: "Logged in successfully",
    user: {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      userType: req.user.userType,
      avatarUrl: req.user.avatarUrl,
    },
  });
};

const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Successfully logged out." });
  });
};

const checkAuthentication = (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      isAuthenticated: true,
      user: req.user,
    });
  } else {
    res.status(200).json({ isAuthenticated: false });
  }
};

const userController = {
  globalLeaderboard,
  register,
  registerAdmin,
  verifyEmail,
  login,
  logout,
  checkAuthentication,
};

module.exports = userController;
