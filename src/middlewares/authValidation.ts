import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants';
const refreshTokenSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Refresh Token is required.',
  }),
});

const validateRefreshToken = (req: Request, res: Response, next: NextFunction): Response | void => {
  const { error } = refreshTokenSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    let errors: any = {};
    error.details.forEach((detail: any) => {
      errors[detail.path[0]] = detail.message;
    });
    return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);
  }

  next();
};

export { validateRefreshToken };
