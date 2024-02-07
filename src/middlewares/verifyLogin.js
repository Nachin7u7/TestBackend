const validateLoginInput = (req, res, next) => {
    const { username, password } = req.body;
    let errors = {};

    if (!username) errors.username = "Please enter your username or email.";
    if (!password) errors.password = "Plese enter your password.";

    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    next();
};

module.exports = validateLoginInput;

