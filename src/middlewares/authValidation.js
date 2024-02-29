const Joi = require('joi');

const refreshTokenSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Refresh Token is required.',
  }),
});

const validateRefreshToken = (req, res, next) => {
  const { error } = refreshTokenSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    let errors = {};
    error.details.forEach((detail) => {
      errors[detail.path[0]] = detail.message;
    });
    return res.status(400).json(errors);
  }

  next();
};

module.exports = { validateRefreshToken };
