const userService = require("../services/userService");
const userServices = require("../services/userServices");
const passport = require('passport');

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
      await userServices.registerUser({ username, email, password });
      res.status(201).json({ message: "Registration successful. Please check your email to verify your account." });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

const verifyEmail = async (req, res) => {
  try {
      const { token } = req.params;
      await userServices.verifyEmail(token);
      res.status(200).json({ message: "Email verified successfully. You can now login." });
  } catch (error) {
      res.status(400).json({ message: "Failed to verify email. Invalid or expired token." });
  }
}

const login = async (req, res) => {
  try {
      const { username, password } = req.body;
      const user = await userService.authenticateUser(username, password);
      req.login(user, (err) => {
          if (err) {
              throw err;
          }
          res.status(200).json({
              message: "Logged in successfully",
              user: {
                  _id: user._id,
                  username: user.username,
                  email: user.email,
                  userType: user.userType,
                  avatarUrl: user.avatarUrl,
              }
          });
      });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
};

const logout = (req, res) => {
  req.logout(function(err) {
      if (err) { return next(err); }
      res.status(200).json({ message: "Successfully logged out." });
  });
}

const checkAuthentication = (req, res) => {
  if (req.isAuthenticated()) {
      res.status(200).json({
          isAuthenticated: true,
          user: req.user
      });
  } else {
      res.status(200).json({ isAuthenticated: false });
  }
}

const userController = { 
  globalLeaderboard,
  register,
  verifyEmail,
  login,
  logout,
  checkAuthentication
};

module.exports = userController;
