const router = require('express').Router();
const problemController = require('../controllers/problemController');
const submissionController = require('../controllers/submissionController');
const userControllers = require('../controllers/userController');
const {
  userAuth,
  verifyAdminIdMatch,
  verifyPermissions,
} = require('../middlewares');

router.get('/getProblemsList', problemController.getProblemsList);
router.get(
  '/getMyProblems',
  userAuth,
  verifyPermissions('isAllowedToCreateProblem'),
  problemController.getMyProblemsList
);

router.get('/getProblemData', problemController.getProblemData);
router.get(
  '/getAdminProblemData',
  userAuth,
  verifyAdminIdMatch,
  verifyPermissions('isAllowedToCreateProblem'),
  problemController.getMyProblemData
);

router.post(
  '/',
  userAuth,
  verifyPermissions('isAllowedToCreateProblem'),
  problemController.createNewProblem
);

router.post(
  '/save',
  userAuth,
  verifyPermissions('isAllowedToCreateProblem'),
  problemController.saveProblem
);
router.post(
  '/saveandpublish',
  userAuth,
  verifyPermissions('isAllowedToCreateProblem'),
  problemController.saveAndPublishProblem
);

router.post('/compileAndRun', userAuth, submissionController.compileAndRun);

router.get(
  '/submissionsList',
  userAuth,
  submissionController.userSubmissionsList
);

router.get(
  '/leaderboard',
  submissionController.leaderboardProblemSubmissionsList
);

router.get('/globalLeaderboard', userControllers.globalLeaderboard);

module.exports = router;
