import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { HTTP_STATUS } from '../constants';

export const validateBody = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(detail => detail.message).join('; ');
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: `Validation failed: ${errorMessages}`,
      });
    }
    next();
  };
};
