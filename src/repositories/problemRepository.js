const Problem = require("../models/problem.model");

const getPublishedProblems = async (isPublished) => {
  const problemsList = await Problem.find(
    {
      isPublished: isPublished,
    },
    {
      _id: 1,
      problemId: 1,
      problemName: 1,
      "published.config": 1,
      solvedCount: 1,
      totalSubmissions: 1,
    }
  );
  return problemsList;
};

const getProblemByIdAndPublished = async (problemId, isPublished) => {
  const problem = await Problem.findOne(
    {
      problemId: problemId,
      isPublished: isPublished,
    },
    {
      _id: 1,
      problemId: 1,
      problemName: 1,
      published: 1,
    }
  );
  return problem;
};

const problemRepository = { getPublishedProblems, getProblemByIdAndPublished };

module.exports = problemRepository;
