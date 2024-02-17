const userRepository = require("../repositories/userRepository");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/sendMail");
const passport = require("passport");
const { passport: passportConfig, CLIENT_URL } = require("../config/config");

const registerUser = async (userData) => {
  const { email, username, password } = userData;

  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error("User with the given email already exists.");
  }

  const user = await userRepository.createUser({
    email,
    username,
    password,
    isConfirmed: false,
  });

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    passportConfig.tokenSecret,
    { expiresIn: "1h" }
  );

  await sendVerificationEmail(email, token);

  return user;
};

const registerAdminUser = async (userData) => {
  const { email, username, password } = userData;

  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error("User with the given email already exists.");
  }

  const user = await userRepository.createUser({
    email,
    username,
    password,
    isConfirmed: false,
    userType: "admin",
  });

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    passportConfig.tokenSecret,
    { expiresIn: "1h" }
  );

  await sendVerificationEmail(email, token);

  return user;
};

const verifyEmail = async (token) => {
  try {
    const decoded = jwt.verify(token, passportConfig.tokenSecret);
    await userRepository.updateUserConfirmation(decoded.email, true);
  } catch (error) {
    throw new Error("Verification failed. Invalid or expired token.");
  }
};

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${CLIENT_URL}/verify/${token}`;
  const htmlContent = `<p>Please verify your email by clicking on the link: <a href="${verificationUrl}">${verificationUrl}</a></p>`;

  await sendMail({
    to: email,
    subject: "Verify Your Email",
    html: htmlContent,
  });
};

const getUsersSortedBySolvedProblems = async () => {
  try {
    const leaderboard = await userRepository.findUsersBySolvedProblems();
    return leaderboard;
  } catch (err) {
    throw err;
  }
};

const userService = {
  getUsersSortedBySolvedProblems,
  registerUser,
  verifyEmail,
  registerAdminUser
};

module.exports = userService;
