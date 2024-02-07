const User = require("../repositories/userRepository");
const getUsersSortedBySolvedProblems = async (req, res) => {
  try {
    const leaderboard = await User.find(
      {},
      {
        _id: 0,
        username: 1,
        "stats.solvedCount": 1,
      }
    ).sort({ "stats.solvedCount": -1 });
    return leaderboard;
  } catch (err) {
    throw err;
  }
};

const userService = { getUsersSortedBySolvedProblems };
module.exports = userService;
