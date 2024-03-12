import jwt from 'jsonwebtoken';
import { config } from '../config';

const tokenSecret = config.jwt.tokenSecret || 'SUPERDUPERTOKEN';

/**
 * Generates a JWT for a user.
 * @param user The user object for whom to generate the token.
 * @returns The generated JWT token.
 */
const generateToken = (user: any): string => {
  return jwt.sign(
    { id: user._id, email: user.email, username: user.username, type: user.userType },
    tokenSecret,
    { expiresIn: config.jwt.tokenExpireIn }
  );
};

/**
 * Generates a Refresh JWT for a user.
 * @param user The user object for whom to generate the token.
 * @returns The generated JWT token.
 */
const generateRefreshToken = (user: any): string => {
  return jwt.sign(
    { id: user._id, email: user.email, username: user.username, type: user.userType },
    tokenSecret,
    { expiresIn: config.jwt.refreshTokenExpireIn }
  );
};

/**
 * Generates an Access JWT for a user.
 * @param user The user object for whom to generate the token.
 * @returns The generated JWT token.
 */
const generateAccessToken = (user: any): string => {
  return jwt.sign(
    { id: user._id, email: user.email, username: user.username, type: user.userType },
    tokenSecret,
    { expiresIn: config.jwt.accessTokenExpireIn }
  );
};

/**
 * Verifies a JWT token and returns the decoded payload if valid.
 * @param token The JWT token to verify.
 * @returns A promise that resolves with the decoded token payload if valid, or rejects if not valid.
 */
const verifyToken = (token: string): Promise<object | string> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, tokenSecret, (err, decoded: any) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

export { generateToken, verifyToken, generateAccessToken, generateRefreshToken };
