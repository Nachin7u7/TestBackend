import Joi from 'joi';
import { HTTP_STATUS } from '../constants';
import { Request, Response, NextFunction } from 'express';

const registerSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username is required.',
    'any.required': 'Username is required.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address.',
    'string.empty': 'Email is required.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long.',
    'string.empty': 'Password is required.',
    'any.required': 'Password is required.',
  }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match.',
    'any.required': 'Confirm password is required.',
  }),
});

const validateRegisterInput = (req: Request, res: Response, next: NextFunction): Response | void => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    let errors: any = {};
    error.details.forEach((detail: any) => {
      errors[detail.path[0]] = detail.message;
    });
    return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);
  }

  next();
};

export default validateRegisterInput;
