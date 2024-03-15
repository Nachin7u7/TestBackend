import bcrypt from 'bcryptjs';

/**
 * Hashes a password using bcrypt.
 * @param password The password to hash.
 * @return The hashed password.
 */
const hashPassword = async (password: string): Promise<string> => {
  const salt: string = await bcrypt.genSalt(10);
  const hashedPassword: string = await bcrypt.hash(password, salt);
  return hashedPassword;
};

/**
 * Compares a plain text password with a hashed password.
 * @param password The plain text password.
 * @param hashedPassword The hashed password to compare against.
 * @return The verdict of comparing passwords.
 */
const comparePasswords = (password: string, hashedPassword: string): boolean => {
  const verdict: boolean = bcrypt.compareSync(password, hashedPassword);
  return verdict;
};

export { hashPassword, comparePasswords };
