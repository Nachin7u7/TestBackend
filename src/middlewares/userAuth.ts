import { Request, Response, NextFunction } from 'express';
import { utils } from '../utils'; // Adjust import path as needed
import { HTTP_STATUS } from '../constants';

const { verifyToken } = utils;

const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await verifyToken(token);
    req.user = decoded as any; // Explicitly typing `decoded` as `any` to append to `req`
    next();
  } catch (err) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Invalid token.',
    });
  }
};

export default userAuth;
