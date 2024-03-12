import { services } from '../services';
import { HTTP_STATUS } from '../constants';
import { buildLogger } from '../plugin';

const logger = buildLogger('problemController');
const {
  getProblems,
  getProblemById,
  getProblemsByAuthor,
  createProblem,
  getProblemWithAuthor,
  saveProblemData,
  saveAndPublishProblemData,
} = services;

const getProblemsList = async (req: any, res: any): Promise<any> => {
  try {
    logger.log('Fetching problems list');
    const problemsList = await getProblems();
    logger.log('Problems list fetched successfully');
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: problemsList,
    });
  } catch (err: any) {
    logger.error(`Error getting problems list: ${err}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Unable to retrieve problems list. Please try again later.',
    });
  }
};
const getProblemData = async (req: any, res: any): Promise<any> => {
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
  } catch (err: any) {
    logger.error(`Error getting problem data for ID ${problemId}: ${err}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error. Please try again.',
    });
  }
};
const getMyProblemsList = async (req: any, res: any): Promise<any> => {
  try {
    const authorId = req.user.id;
    logger.log(`Fetching problems for user with ID: ${authorId}`);
    const problems = await getProblemsByAuthor(authorId);
    logger.log('Problems fetched successfully');
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: problems,
    });
  } catch (error: any) {
    logger.error('Error fetching user problems:', { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const createNewProblem = async (req: any, res: any): Promise<any> => {
  try {
    const userId = req.user.id;
    const { problemName, sampleProblemData } = req.body;
    logger.log(`Creating problem for user with ID: ${userId}`);
    const problem = await createProblem(userId, problemName, sampleProblemData);
    logger.log('Problem created successfully');
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Problem created successfully',
      data: problem,
    });
  } catch (error: any) {
    logger.error('Error creating problem:', { error: error.message });
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};
const saveProblem = async (req: any, res: any): Promise<any> => {
  try {
    const authorId = req.user.id;
    const { _id, problem } = req.body;
    logger.log(`Saving problem with ID: ${_id} for user with ID: ${authorId}`);
    await saveProblemData(_id, authorId, problem);
    logger.log('Problem saved successfully');
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Problem saved successfully',
    });
  } catch (error: any) {
    logger.error('Error saving problem:', { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const saveAndPublishProblem = async (req: any, res: any): Promise<any> => {
  try {
    const authorId = req.user.id;
    const { _id, problem } = req.body;
    logger.log(`Saving and publishing problem with ID: ${_id} for user with ID: ${authorId}`);
    await saveAndPublishProblemData(_id, authorId, problem);
    logger.log('Problem saved and published successfully');
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Problem saved and published successfully',
    });
  } catch (error: any) {
    logger.error('Error saving and publishing problem:', { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyProblemData = async (req: any, res: any): Promise<any> => {
  try {
    const authorId = req.user.id;
    const { problemId } = req.query;
    if (!problemId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Problem ID is required.',
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
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: problem,
    });
  } catch (error: any) {
    logger.error('Error fetching problem data:', { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getProblemsList,
  getProblemData,
  getMyProblemData,
  getMyProblemsList,
  createNewProblem,
  saveProblem,
  saveAndPublishProblem
};

