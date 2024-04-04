import Joi from 'joi';
import { HTTP_STATUS } from '../constants';
import { Request, Response, NextFunction } from 'express';

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address.',
    'string.empty': 'Email is required.',
    'any.required': 'Email is required.',
  }),
});

const validateForgotPasswordInput = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const { error } = forgotPasswordSchema.validate(req.body, {
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

export default validateForgotPasswordInput;
