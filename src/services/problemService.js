const { getPublishedProblems } = require('../repositories/problemRepository');
const { buildLogger } = require('../plugin');

const logger = buildLogger('problemService');

const getProblems = async () => {
  logger.log('Attempting to fetch the list of problems.');
  try {
    let problemsList = await getPublishedProblems(true);
    problemsList = JSON.parse(JSON.stringify(problemsList));
    for (let i = 0; i < problemsList.length; i++) {
      if (problemsList[i].totalSubmissions >= 1)
        problemsList[i].acceptance =
          (problemsList[i].solvedCount / problemsList[i].totalSubmissions) *
          100;
      else problemsList[i].acceptance = 0;
    }
    logger.log('Successfully fetched the list of problems.', problemsList );
    return problemsList;
  } catch (err) {
    logger.error('Error while fetching the list of problems.', {
      error: err.message,
    });
    throw new Error('Failed to fetch the list of problems.');
  }
};

const getProblemById = async (problemId) => {
  logger.log('Attempting to fetch the problem by id.', {
    problemId: problemId,
  });
  try {
    const problem = await problemRepository.getProblemByIdAndPublished(
      problemId,
      true
    );
    logger.log('Successfully fetched the problem by id.', {
      problemId: problemId,
    });
    return problem;
  } catch (err) {
    logger.error('Error while fetching the problem by id.', {
      error: err.message,
      problemId: problemId,
    });
    throw new Error('Failed to fetch the problem by id.');
  }
};

const problemService = { getProblems, getProblemById };

module.exports = problemService;
