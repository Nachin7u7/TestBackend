const problemRepository = require("../repositories/problemRepository");

const getProblems = async () => {
  try {
    let problemsList = await problemRepository.getPublishedProblems(true);
    problemsList = JSON.parse(JSON.stringify(problemsList));
    for (let i = 0; i < problemsList.length; i++) {
      if (problemsList[i].totalSubmissions >= 1)
        problemsList[i].acceptance =
          (problemsList[i].solvedCount / problemsList[i].totalSubmissions) *
          100;
      else problemsList[i].acceptance = 0;
    }
    return problemsList;
  } catch (err) {
    throw err;
  }
};

const getProblemById = async (req) => {
  try {
    const problemId = req.query.problemId;
    const problem = await problemRepository.getProblemByIdAndPublished(
      problemId,
      true
    );
    return problem;
  } catch (err) {
    throw err;
  }
};

const problemService = { getProblems, getProblemById };

module.exports = problemService;
