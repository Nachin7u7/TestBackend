const userRepository = require("../repositories/userRepository");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/sendMail");
const passport = require("passport");

const registerUser = async (userData) => {
  const { email, username, password } = userData;

  // Verificar si el usuario ya existe
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error("User with the given email already exists.");
  }

  // Crear el usuario
  const user = await userRepository.createUser({
    email,
    username,
    password,
    isConfirmed: false,
  });

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.TOKEN_SECRET,
    { expiresIn: "1h" }
  );
  await sendVerificationEmail(email, token);

  return user;
};

const verifyEmail = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    await userRepository.updateUserConfirmation(decoded.email, true);
  } catch (error) {
    throw new Error("Verification failed. Invalid or expired token.");
  }
};

const sendVerificationEmail = async (email, token) => {
  // Implementación simplificada. Asegúrate de adaptarla según tu lógica de envío de correos.
  const verificationUrl = `${CLIENT_URL}/verify/${token}`;
  const htmlContent = `<p>Please verify your email by clicking on the link: <a href="${verificationUrl}">${verificationUrl}</a></p>`;

  await sendMail({
    to: email,
    subject: "Verify Your Email",
    html: htmlContent,
  });
};

const authenticateUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const user = { username, password };
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        reject(err);
      } else if (!user) {
        reject(new Error("Invalid username or password"));
      } else {
        resolve(user);
      }
    })({ body: user });
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
  authenticateUser,
};
module.exports = userService;
