const bcrypt = require('bcryptjs');
const { encrypt } = require('../../src/utils');

const { hashPassword } = encrypt;

describe('hashPassword', () => {
  it('should return a hashed password different from the original', async () => {
    const password = 'test123';
    const hashed = await hashPassword(password);

    expect(hashed).not.toBe(password);
  });

  it('should generate a unique salt for each hashing', async () => {
    const password = 'uniqueTest';
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    expect(hash1).not.toBe(hash2);
  });

  it('should successfully compare a password to its hash', async () => {
    const password = 'toCompare';
    const hashed = await hashPassword(password);

    const match = await bcrypt.compare(password, hashed);
    expect(match).toBe(true);
  });
});
