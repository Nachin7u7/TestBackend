const userService = require("../services/userService");

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

const userControllers = { globalLeaderboard };

module.exports = userControllers;
