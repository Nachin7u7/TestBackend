import express from 'express';
import { problemController, submissionController, userController } from '../controllers';
import { userAuth, verifyAdminIdMatch, verifyPermissions } from '../middlewares';
import { createValidatorForSchema } from '../middlewares/schemaValidator';
import { newProblemSchema } from '../schemas/newProblemSchema';
import { problemDataSchema } from '../schemas/problemDataSchema';
import { createValidator } from 'express-joi-validation';
import problemIdSchema from '../schemas/problemIdSchema';

const problemRouter = express.Router();
const validator = createValidator()

problemRouter.get('/getProblemsList', problemController.getProblemsList);

problemRouter.get(
  '/getMyProblems',
  userAuth,
  verifyPermissions('isAllowedToCreateProblem'),
  problemController.getMyProblemsList
);

problemRouter.get(
  '/getProblemData',
  validator.query(problemIdSchema), 
  problemController.getProblemData
);

problemRouter.get(
  '/getAdminProblemData',
  userAuth,
  verifyAdminIdMatch,
  verifyPermissions('isAllowedToCreateProblem'),
  validator.query(problemIdSchema),
  problemController.getMyProblemData
);

problemRouter.post(
  '/',
  createValidatorForSchema(newProblemSchema),
  userAuth,
  verifyPermissions('isAllowedToCreateProblem'),
  problemController.createNewProblem
);

problemRouter.post(
  '/save',
  createValidatorForSchema(problemDataSchema),
  userAuth,
  verifyPermissions('isAllowedToCreateProblem'),
  problemController.saveProblem
);

problemRouter.post(
  '/saveandpublish',
  createValidatorForSchema(problemDataSchema),
  userAuth,
  verifyPermissions('isAllowedToCreateProblem'),
  problemController.saveAndPublishProblem
);

problemRouter.post('/compileAndRun', userAuth, submissionController.compileAndRun);

problemRouter.get(
  '/submissionsList',
  userAuth,
  submissionController.userSubmissionsList
);

problemRouter.get(
  '/leaderboard',
  submissionController.leaderboardProblemSubmissionsList
);

problemRouter.get('/globalLeaderboard', userController.globalLeaderboard);

export default problemRouter;
