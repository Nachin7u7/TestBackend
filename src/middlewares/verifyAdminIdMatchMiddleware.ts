import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants';

const verifyAdminIdMatch = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.user as any;
    const adminId = req.query.adminId as string;
    if (!adminId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Make sure to pass the query parameter adminId',
        });
    }
    if (adminId !== id) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: 'Request rejected, credentials do not match',
        });
    }
    next();
}

export default verifyAdminIdMatch;
