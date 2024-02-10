const validateRegisterInput = (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  let errors = {};

  if (!username) errors.username = "Username is required.";
  if (!email) errors.email = "Email is required.";
  if (!password) errors.password = "Password is required.";
  else {
    if (!confirmPassword) errors.confirmPassword = "Confirm Password is required.";
    else {
      if (password !== confirmPassword)
        errors.confirmPassword = "Passwords do not match.";
      if (password.length < 8)
        errors.password = "Password must be at least 8 characters long.";
    }
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  next();
};

module.exports = validateRegisterInput;
