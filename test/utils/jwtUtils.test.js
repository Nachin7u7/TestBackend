const jwt = require('jsonwebtoken');
const { jwtUtils } = require('../../src/utils');
const { generateToken, verifyToken } = jwtUtils;
jest.mock('jsonwebtoken');

const mockUser = {
  _id: '123',
  email: 'test@example.com',
};

const mockConfig = {
  jwt: {
    tokenSecret: 'secret',
    tokenExpireIn: '1h',
  },
};

describe('Auth Functions', () => {
  describe('generateToken', () => {
    it('should generate a token for a user', () => {
      const token = 'fake.jwt.token';
      jwt.sign.mockReturnValue(token);
      const result = generateToken(mockUser);
      expect(result).toBe(token);
    });
  });

  describe('verifyToken', () => {
    it('should verify a token and return decoded payload', async () => {
      const token = 'fake.jwt.token';
      const decodedPayload = { userId: mockUser._id, email: mockUser.email };
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, decodedPayload);
      });

      const result = await verifyToken(token);

      expect(result).toEqual(decodedPayload);
    });

    it('should reject if token verification fails', async () => {
      const token = 'invalid.token';
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error('invalid token'), null);
      });

      await expect(verifyToken(token)).rejects.toThrow(
        'invalid token'
      );
    });
  });
});
