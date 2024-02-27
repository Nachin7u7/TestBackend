const router = require('express').Router();
const userAuth = require('../middlewares/userAuth');
const verifyPermissions = require("../middlewares/verifyPermissions");
const problemController = require('../controllers/problemController');
const submissionController = require('../controllers/submissionController');
const userControllers = require('../controllers/userController');

router.get('/getProblemsList', problemController.getProblemsList);
router.get('/admin/getMyProblems', userAuth, problemController.getMyProblemsList);

router.get('/getProblemData', problemController.getProblemData);
router.get('/admin/getProblemData', userAuth, problemController.getMyProblemData);

router.post('/admin/create', userAuth, verifyPermissions('isAllowedToCreateProblem'), problemController.createNewProblem);
router.post('/admin/save', userAuth, verifyPermissions('isAllowedToCreateProblem'), problemController.saveProblem);
router.post('/admin/saveandpublish', userAuth, verifyPermissions('isAllowedToCreateProblem'), problemController.saveAndPublishProblem);

router.post('/compileAndRun', userAuth, submissionController.compileAndRun);

router.get('/submissionsList', userAuth, submissionController.userSubmissionsList);

router.get('/leaderboard', submissionController.leaderboardProblemSubmissionsList);

router.get('/globalLeaderboard', userControllers.globalLeaderboard);




module.exports = router;
