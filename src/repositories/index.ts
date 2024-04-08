import problemRepository from './problemRepository';
import submissionRepository from './submissionRepository';
import userRepository from './implements/userRepositoryImpl';

export const repositories = {
  ...problemRepository,
  ...submissionRepository,
  ...userRepository,
};
