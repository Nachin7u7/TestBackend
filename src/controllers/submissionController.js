const submissionService = require("../services/submissionService");

const userSubmissionsList = async (req, res) => {
  try {
    const submissionsList =
      await submissionService.getUsernameProblemIdSubmissions(req);
    return res.status(200).json({
      success: true,
      submissionsList: submissionsList,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

const leaderboardProblemSubmissionsList = async (req, res) => {
  try {
    const submissions = await submissionService.getAcceptedProblemIdSubmissions(
      req
    );
    return res.status(200).json({
      success: true,
      leaderboard: submissions,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

const compileAndRun = async (req, res) => {
  try {
    let veredict = await submissionService.postSubmission(req);
    return res.status(200).json({
      success: true,
      veredict: veredict,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

const submissionControllers = {
  userSubmissionsList,
  leaderboardProblemSubmissionsList,
  compileAndRun,
};

module.exports = submissionControllers;
