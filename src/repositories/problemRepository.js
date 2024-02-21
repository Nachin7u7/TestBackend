const Problem = require('../models/problem.model');
const { buildLogger } = require('../plugin');

const logger = buildLogger('problemRepository');
const getPublishedProblems = async (isPublished) => {
  logger.log('Attempting to fetch problems by isPublished status.', {
    isPublished: isPublished,
  });
  try {
    const problemsList = await Problem.find(
      {
        isPublished: isPublished,
      },
      {
        _id: 1,
        problemId: 1,
        problemName: 1,
        'published.config': 1,
        solvedCount: 1,
        totalSubmissions: 1,
      }
    );
    logger.log('Successfully fetched problems by isPublished status.');
    return problemsList;
  } catch (error) {
    logger.error('Error while fetching problems by isPublished status.', {
      error: error.message,
      isPublished: isPublished
    });
    throw new Error('Failed to fetch published problems: ' + error.message);
  }
};

const getProblemByIdAndPublished = async (problemId, isPublished) => {
  logger.log('Attempting to fetch problem by id and published status.', {
    problemId: problemId,
    isPublished: isPublished,
  });
  try {
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
    logger.log('Successfully fetched problem by id and published status.');
    return problem;
  } catch (error) {
    logger.error('Error while fetching problem by id and published status.', {
      error: error.message,
      problemId: problemId,
      isPublished: isPublished,
    });
    throw new Error(
      'Failed to fetch problem by id and published status: ' + error.message
    );
  }
};

const problemRepository = { getPublishedProblems, getProblemByIdAndPublished };

module.exports = problemRepository;
