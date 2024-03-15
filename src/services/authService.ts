import { utils } from '../utils';
import { buildLogger } from '../plugin';

const { verifyToken } = utils
const logger = buildLogger('authService');

const verifyRefreshToken = async (refreshToken: string): Promise<any> => {
  try {
    const decoded = await verifyToken(refreshToken);
    //TODO: getNewToken
    logger.log('Token verification successful', { decoded });
    return decoded;
  } catch (error: any) {
    logger.error('Error verifying refresh token', { error: error.message });
    throw new Error('Error verifying refresh token');
  }
};

export { verifyRefreshToken };
