const problemService = require('../services/problemService');
const { buildLogger } = require('../plugin');
const { HTTP_STATUS } = require('../constants');

const logger = buildLogger('problemController');

const getProblemsList = async (req, res) => {
  try {
    logger.log('Fetching problems list');
    const problemsList = await problemService.getProblems();
    logger.log('Problems list fetched successfully');
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: problemsList,
    });
  } catch (err) {
    logger.error(`Error getting problems list: ${err}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Unable to retrieve problems list. Please try again later.',
    });
  }
};

const getProblemData = async (req, res) => {
  const { problemId } = req.query;
  if (!problemId) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Problem ID is required.',
    });
  }
  try {
    logger.log(`Fetching problem data for ID: ${problemId}`);
    const problem = await problemService.getProblemById(problemId);
    logger.log(`Problem data fetched successfully for ID: ${problemId}`);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: problem,
    });
  } catch (err) {
    logger.error(`Error getting problem data for ID ${problemId}: ${err}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error. Please try again.',
    });
  }
};

module.exports = {
  getProblemsList,
  getProblemData,
};
