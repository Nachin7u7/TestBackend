const Submission = require("../models/submission.model");
const { buildLogger } = require('../plugin');

const logger = buildLogger('submissionRepository');
const getUsernameProblemIdSubmissions = async (username, problemId) => {
  logger.log('Attempting to fetch submissions for the given username and problem id.', {
    username: username,
    problemId: problemId
  });
  try {
    const submissionsList = await Submission.find({
      username: username,
      problemId: problemId,
    });
    logger.log('Successfully fetched submissions for the given username and problem id.');
    return submissionsList;
  } catch (error) {
    logger.error('Error while fetching submissions for the given username and problem id.', {
      error: error.message,
      username: username,
      problemId: problemId
    });
    throw new Error('Failed to fetch submissions for the given username and problem id: ' + error.message);
  }
};

const getAcceptedProblemIdSubmissions = async (problemId) => {
  logger.log('Attempting to fetch accepted submissions for the given problem id.', {
    problemId: problemId
  });
  try {
    const submissions = await Submission.find({
      problemId: problemId,
      verdict: "Accepted!",
    });
    logger.log('Successfully fetched accepted submissions for the given problem id.');
    return submissions;
  } catch (error) {
    logger.error('Error while fetching accepted submissions for the given problem id.', {
      error: error.message,
      problemId: problemId
    });
    throw new Error('Failed to fetch accepted submissions for the given problem id: ' + error.message);
  }
};


const submissionRepository = {
  getUsernameProblemIdSubmissions,
  getAcceptedProblemIdSubmissions,
};

module.exports = submissionRepository;
