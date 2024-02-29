const { verifyRefreshToken } = require('../../src/services/authService'); // Asegúrate de ajustar la ruta
const { jwtUtils } = require('../../src/utils');
const { buildLogger } = require('../../src/plugin');

jest.mock('../../src/utils', () => ({
  jwtUtils: {
    verifyToken: jest.fn(),
  },
}));
jest.mock('../../src/plugin', () => ({
  buildLogger: () => ({
    log: jest.fn(),
    error: jest.fn(),
  }),
}));

describe('verifyRefreshToken', () => {
  const mockDecodedToken = { userId: '123', iat: 123456789, exp: 987654321 };
  const mockRefreshToken = 'authService';

  it('should verify token successfully and log the event', async () => {
    jwtUtils.verifyToken.mockResolvedValue(mockDecodedToken);
    const result = await verifyRefreshToken(mockRefreshToken);

    expect(jwtUtils.verifyToken).toHaveBeenCalledWith(mockRefreshToken);
    expect(result).toEqual(mockDecodedToken);
  });

  it('should log an error and throw if token verification fails', async () => {
    jwtUtils.verifyToken.mockRejectedValue(new Error('Invalid token'));

    await expect(verifyRefreshToken(mockRefreshToken)).rejects.toThrow(
      'Error verifying refresh token'
    );

    expect(jwtUtils.verifyToken).toHaveBeenCalledWith(mockRefreshToken);
  });
});
