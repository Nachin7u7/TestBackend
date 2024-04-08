import problemRepository from './problemRepository';
import submissionRepository from './submissionRepository';


export const repositories = {
  ...problemRepository,
  ...submissionRepository
};
