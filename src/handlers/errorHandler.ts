import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: "Api url doesn't exist",
  });
};

const catchErrors = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return function(req: Request, res: Response, next: NextFunction) {
    return fn(req, res, next).catch((error: any) => {
      if (error.name == 'ValidationError') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          result: null,
          message: 'Required fields are not supplied',
          controller: fn.name,
          error: error,
        });
      } else {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          result: null,
          message: error.message,
          controller: fn.name,
          error: error,
        });
      }
    });
  };
};

export { notFound, catchErrors };
