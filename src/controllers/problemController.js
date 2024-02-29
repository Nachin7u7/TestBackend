const {
  getProblems,
  getProblemById,
  getMyProblems,
  createProblem,
  getProblemWithAuthor,
  saveProblemData,
  saveAndPublishProblemData,
} = require('../services/problemService');
const { buildLogger } = require('../plugin');
const { HTTP_STATUS } = require('../constants');

const logger = buildLogger('problemController');

const getProblemsList = async (req, res) => {
  try {
    logger.log('Fetching problems list');
    const problemsList = await getProblems();
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
    const problem = await getProblemById(problemId);
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
const getMyProblemsList = async (req, res) => {
  try {
    const authorId = req.user.id;
    logger.log(`Fetching problems for user with ID: ${authorId}`);

    logger.log('Problems fetched successfully');
    const problems = await getMyProblems(authorId);
    res.json({
      success: true,
      data: problems,
    });
  } catch (error) {
    logger.error('Error fetching user problems:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const createNewProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { problemName, sampleProblemData } = req.body;
    logger.log(`Creating problem for user with ID: ${userId}`);
    const problem = await createProblem(
      userId,
      problemName,
      sampleProblemData
    );
    logger.log('Problem created successfully');
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Problem created successfully',
      data: problem,
    });
  } catch (error) {
    logger.error('Error creating problem:', error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};

const saveProblem = async (req, res) => {
  try {
    const authorId = req.user.id;

    const { _id, problem } = req.body;
    logger.log(`Saving problem with ID: ${_id} for user with ID: ${authorId}`);
    await saveProblemData(_id, authorId, problem);
    logger.log('Problem saved successfully');
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Problem saved successfully',
    });
  } catch (error) {
    logger.error('Error saving problem:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const saveAndPublishProblem = async (req, res) => {
  try {
    const authorId = req.user.id;

    const { _id, problem } = req.body; // Asume que estos datos están presentes en la solicitud
    logger.log(`Saving and publishing problem with ID: ${_id} for user with ID: ${authorId}`);
    await saveAndPublishProblemData(_id, authorId, problem);
    logger.log('Problem saved and published successfully');
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Problem saved and published successfully',
    });
  } catch (error) {
    logger.error('Error saving and publishing problem:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyProblemData = async (req, res) => {
  try {
    const authorId = req.user.id;
    const { problemId } = req.query;
    if(!problemId){
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Make sure to pass the query parameter problemId',
      });
    }
    logger.log(`Fetching data for problem with ID: ${problemId} for user with ID: ${authorId}`);
    const problem = await getProblemWithAuthor(problemId, authorId);
    if (!problem) {
      logger.log(`Problem not found with ID: ${problemId}`);
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Problem not found',
      });
    }
    logger.log('Problem data fetched successfully');
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    logger.error('Error fetching problem data:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const problemController = {
  getProblemsList,
  getProblemData,
  getMyProblemData,
  getMyProblemsList,
  createNewProblem,
  saveProblem,
  saveAndPublishProblem
}

module.exports = problemController;
