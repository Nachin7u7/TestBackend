const { authenticateUser } = require('../../src/services/userService');
const userRepository = require('../../src/repositories/userRepository');
const encrypt = require('../../src/utils/encrypt');
const jwtUtils = require('../../src/utils/jwtUtils');

jest.mock('../../src/repositories/userRepository');
jest.mock('../../src/utils/encrypt');
jest.mock('../../src/utils/jwtUtils');

describe('authenticateUser', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if user is not found', async () => {
    userRepository.findUserByUsernameOrEmail.mockResolvedValue(null);

    await expect(
      authenticateUser('nonexistentuser', 'password')
    ).rejects.toThrow('User not found');
  });

  it('should throw an error if password does not match', async () => {
    const mockUser = {
      _id: 'userId',
      username: 'user',
      password: 'encryptedPassword',
    };
    userRepository.findUserByUsernameOrEmail.mockResolvedValue(mockUser);
    encrypt.comparePasswords.mockResolvedValue(false);

    await expect(authenticateUser('user', 'wrongPassword')).rejects.toThrow(
      'Invalid credentials'
    );
  });

  it('should return user data and tokens if authentication is successful', async () => {
    const mockUser = {
      _id: 'userId',
      username: 'user',
      email: 'user@example.com',
      userType: 'userType',
      avatarUrl: 'avatarUrl',
      password: 'encryptedPassword',
    };
    userRepository.findUserByUsernameOrEmail.mockResolvedValue(mockUser);
    encrypt.comparePasswords.mockResolvedValue(true);
    jwtUtils.generateAccessToken.mockReturnValue('accessToken');
    jwtUtils.generateRefreshToken.mockReturnValue('refreshToken');

    const result = await authenticateUser('user', 'password');

    expect(result).toEqual({
      id: mockUser._id,
      token: 'accessToken',
      refreshToken: 'refreshToken',
      username: mockUser.username,
      email: mockUser.email,
      userType: mockUser.userType,
      avatarUrl: mockUser.avatarUrl,
    });
  });
});
