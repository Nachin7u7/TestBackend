import express from 'express';
import {submissionController, userController, problemController } from '../controllers';
import { userAuth, verifyAdminIdMatch, verifyPermissions } from '../middlewares';

const problemRouter = express.Router();

problemRouter.get('/getProblemsList', problemController.getProblemList);

problemRouter.get(
  '/getMyProblems',
  userAuth,
  verifyPermissions('isAllowedToCreateProblem'),
  problemController.getMyProblemsList
);

problemRouter.get('/getProblemData', problemController.getProblemData);

problemRouter.get(
  '/getAdminProblemData',
  userAuth,
  // verifyAdminIdMatch,
  verifyPermissions('isAllowedToCreateProblem'),
  problemController.getMyProblemData
);

problemRouter.post(
  '/',
  userAuth,
  verifyPermissions('isAllowedToCreateProblem'),
  problemController.createNewProblem
);

problemRouter.post(
  '/save',
  userAuth,
  verifyPermissions('isAllowedToCreateProblem'),
  problemController.saveProblem
);

problemRouter.post(
  '/saveandpublish',
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
