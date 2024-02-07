const problemService = require("../services/problemService");
const getProblemsList = async (req, res) => {
  try {
    problemsList = await problemService.getProblems();
    return res.status(200).json({
      success: true,
      problemsList,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};
const getProblemData = async (req, res) => {
  try {
    const problem = await problemService.getProblemById(req.query.problemId);
    return res.status(200).json({
      success: true,
      problem,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

const problemControllers = { getProblemsList, getProblemData };

module.exports = problemControllers;
