import * as authService from './authService';
import * as emailService from './emailService';
import * as jdoodleService from './jdoodleService';
import * as problemService from './problemService';
import * as submissionService from './submissionService';
import * as userService from './userService';

export const services = {
  ...authService,
  ...emailService,
  ...jdoodleService,
  ...problemService,
  ...submissionService,
  ...userService
};
