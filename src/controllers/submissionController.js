const submissionService = require('../services/submissionService');
const { buildLogger } = require('../plugin');

const logger = buildLogger('submissioControllers');

const userSubmissionsList = async (req, res) => {
  try {
    logger.log('Fetching user submissions list');
    const { username, problemId } = req.query;
    const submissionsList =
      await submissionService.getUsernameProblemIdSubmissions(
        username,
        problemId
      );
    logger.log('User submissions list fetched successfully');
    return res.status(200).json({
      success: true,
      submissionsList: submissionsList,
    });
  } catch (err) {
    logger.error('Error fetching user submissions list:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again.',
    });
  }
};

const leaderboardProblemSubmissionsList = async (req, res) => {
  try {
    const { problemId } = req.query;
    logger.log('Fetching leaderboard problem submissions list');

    const submissions = await submissionService.getAcceptedProblemIdSubmissions(
      problemId
    );
    logger.log('Leaderboard problem submissions list fetched successfully');
    return res.status(200).json({
      success: true,
      leaderboard: submissions,
    });
  } catch (err) {
    logger.error('Error fetching leaderboard problem submissions list:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again.',
    });
  }
};

const compileAndRun = async (req, res) => {
  try {
    logger.log('Compiling and running submission');
    let veredict = await submissionService.postSubmission(req);
    logger.log('Submission compiled and run successfully');
    return res.status(200).json({
      success: true,
      veredict: veredict,
    });
  } catch (err) {
    logger.error('Error compiling and running submission:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again.',
    });
  }
};

const submissionControllers = {
  userSubmissionsList,
  leaderboardProblemSubmissionsList,
  compileAndRun,
};

module.exports = submissionControllers;
