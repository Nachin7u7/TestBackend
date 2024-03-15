import { Request, Response } from 'express';
import { buildLogger } from '../plugin';
import { successHandler } from '../handlers';
import { verifyRefreshToken } from '../services/authService';
import { HTTP_STATUS } from '../constants';

const logger = buildLogger('authController');

const refreshToken = async (req: Request, res: Response): Promise<any> => {
  try {
    logger.log('Refresh Token');
    const { token } = req.body;
    const tokenResponse = await verifyRefreshToken(token);
    successHandler.sendOkResponse(res, tokenResponse, 'Token refreshed successfully');
  } catch (err: any) {
    logger.error(`Error getting new Token: ${err}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Unable to retrieve token. Please try again later.',
    });
  }
};

export { refreshToken };
