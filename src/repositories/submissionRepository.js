const Submission = require("../models/submission.model");

const getUsernameProblemIdSubmissions = async (username, problemId) => {
  try {
    const submissionsList = await Submission.find({
      username: username,
      problemId: problemId,
    });
    return submissionsList;
  } catch (error) {
    throw error;
  }
};

const getAcceptedProblemIdSubmissions = async (problemId) => {
  try {
    const submissions = await Submission.find({
      problemId: problemId,
      verdict: "Accepted!",
    });
    return submissions;
  } catch (error) {
    throw error;
  }
};

const submissionRepository = {
  getUsernameProblemIdSubmissions,
  getAcceptedProblemIdSubmissions,
};

module.exports = submissionRepository;
