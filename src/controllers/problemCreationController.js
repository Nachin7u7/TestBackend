const problemCreationService = require('../services/problemCreationService');
const { buildLogger } = require('../plugin');

const logger = buildLogger('problemCreationController');

exports.getMyProblems = async (req, res) => {
  try {
    const authorId = req.user.id;
    logger.log(`Fetching problems for user with ID: ${authorId}`);

    logger.log('Problems fetched successfully');
    const problems = await problemCreationService.getMyProblems(authorId);
    res.json({
      success: true,
      data: problems,
    });
  } catch (error) {
    logger.error('Error fetching user problems:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { problemName, sampleProblemData } = req.body;
    logger.log(`Creating problem for user with ID: ${userId}`);
    const problem = await problemCreationService.createProblem(
      userId,
      problemName,
      sampleProblemData
    );
    logger.log('Problem created successfully');
    res.status(200).json({
      success: true,
      message: 'Problem created successfully',
      data: problem,
    });
  } catch (error) {
    logger.error('Error creating problem:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProblemData = async (req, res) => {
  try {
    const authorId = req.user.id;

    const { _id } = req.query;
    logger.log(`Fetching data for problem with ID: ${_id} for user with ID: ${authorId}`);
    const problem = await problemCreationService.getProblemData(_id, authorId);
    if (!problem) {
      logger.log(`Problem not found with ID: ${_id}`);
      return res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
    }
    logger.log('Problem data fetched successfully');
    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    logger.error('Error fetching problem data:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.saveProblem = async (req, res) => {
  try {
    const authorId = req.user.id;

    const { _id, problem } = req.body;
    logger.log(`Saving problem with ID: ${_id} for user with ID: ${authorId}`);
    await problemCreationService.saveProblem(_id, authorId, problem);
    logger.log('Problem saved successfully');
    res.status(200).json({
      success: true,
      message: 'Problem saved successfully',
    });
  } catch (error) {
    logger.error('Error saving problem:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.saveAndPublishProblem = async (req, res) => {
  try {
    const authorId = req.user.id;

    const { _id, problem } = req.body; // Asume que estos datos están presentes en la solicitud
    logger.log(`Saving and publishing problem with ID: ${_id} for user with ID: ${authorId}`);
    await problemCreationService.saveAndPublishProblem(_id, authorId, problem);
    logger.log('Problem saved and published successfully');
    res.status(200).json({
      success: true,
      message: 'Problem saved and published successfully',
    });
  } catch (error) {
    logger.error('Error saving and publishing problem:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
