const router = require('express').Router();
const userAuth = require('../middlewares/userAuth');
const verifyPermissions = require("../middlewares/verifyPermissions");
const problemController = require('../controllers/problemController');
const submissionController = require('../controllers/submissionController');
const userControllers = require('../controllers/userController');
const { adminMatchCredentials } = require('../middlewares');

router.get('/getProblemsList', problemController.getProblemsList);
router.get('/getMyProblems', userAuth, verifyPermissions('isAllowedToCreateProblem'), problemController.getMyProblemsList);

router.get('/getProblemData', problemController.getProblemData);
router.get('/getAdminProblemData', userAuth, adminMatchCredentials, verifyPermissions('isAllowedToCreateProblem'), problemController.getMyProblemData);

router.post('/create', userAuth, verifyPermissions('isAllowedToCreateProblem'), problemController.createNewProblem);
router.post('/save', userAuth, verifyPermissions('isAllowedToCreateProblem'), problemController.saveProblem);
router.post('/saveandpublish', userAuth, verifyPermissions('isAllowedToCreateProblem'), problemController.saveAndPublishProblem);

router.post('/compileAndRun', userAuth, submissionController.compileAndRun);

router.get('/submissionsList', userAuth, submissionController.userSubmissionsList);

router.get('/leaderboard', submissionController.leaderboardProblemSubmissionsList);

router.get('/globalLeaderboard', userControllers.globalLeaderboard);




module.exports = router;
