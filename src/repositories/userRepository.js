const User = require("../models/user.model");

const createUser = async (userData) => {
  const user = new User(userData);
  return user.save();
};

const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

const findUserByUsernameOrEmail = async (username, email) => {
  return User.findOne({
    $or: [{ username }, { email }],
  });
};

const updateUserConfirmation = async (email, isConfirmed) => {
  return User.findOneAndUpdate(
    { email },
    { $set: { isConfirmed } },
    { new: true }
  );
};

const deleteUserIfUnconfirmed = async (email) => {
  return User.deleteOne({ email, isConfirmed: false });
};

const findUsersBySolvedProblems = async () => {
  const users = await User.find(
    {},
    {
      _id: 0,
      username: 1,
      "stats.solvedCount": 1,
    }
  ).sort({ "stats.solvedCount": -1 });
  return users;
};
module.exports = {
  createUser,
  findUserByEmail,
  findUserByUsernameOrEmail,
  findUsersBySolvedProblems,
  updateUserConfirmation,
  deleteUserIfUnconfirmed,
};
