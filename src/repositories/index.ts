import problemRepository from './problemRepository';
import submissionRepository from './submissionRepository';
import userRepository from './userRepository';

export const repositories = {
  ...problemRepository,
  ...submissionRepository,
  ...userRepository,
};
