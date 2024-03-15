import {repositories} from '../repositories'
import { buildLogger } from '../plugin';
const {
  findProblemsByPublished,
  findProblemByIdAndPublished,
  findProblemsByAuthor,
  findProblemByIdAndAuthor,
  updateProblem,
  findProblemByName,
  createNewProblem,
  publishProblem,
  incrementProblemIdCounter,
} = repositories;


const logger = buildLogger('problemService');

/**
 * Fetches the list of all published problems.
 * @returns {Promise<Array>} A promise that resolves to an array of problems with their acceptance rates calculated.
 */
const getProblems = async (): Promise<any> => {
  logger.log('Attempting to fetch the list of problems.');
  try {
    let problemsList = await findProblemsByPublished(true);
    problemsList = JSON.parse(JSON.stringify(problemsList));
    problemsList.forEach((problem: any) => {
      problem.acceptance = problem.totalSubmissions >= 1 ? (problem.solvedCount / problem.totalSubmissions) * 100 : 0;
    });
    logger.log('Successfully fetched the list of problems.', problemsList);
    return problemsList;
  } catch (err: any) {
    logger.error('Error while fetching the list of problems.', {
      error: err.message,
    });
    throw new Error('Failed to fetch the list of problems.');
  }
};

/**
 * Fetches a specific problem by its ID if it's published.
 * @param {Number} problemId - The ID of the problem to fetch.
 * @returns {Promise<Object>} A promise that resolves to the problem object.
 */
const getProblemById = async (problemId: number): Promise<any> => {
  logger.log('Attempting to fetch the problem by id.', { problemId });
  try {
    const problem = await findProblemByIdAndPublished(problemId, true);
    logger.log('Successfully fetched the problem by id.', { problemId });
    return problem;
  } catch (err: any) {
    logger.error('Error while fetching the problem by id.', {
      error: err.message,
      problemId,
    });
    throw new Error('Failed to fetch the problem by id.');
  }
};

/**
 * Fetches problems created by a specific author.
 * @param {String} authorId - The ID of the author whose problems to fetch.
 * @returns {Promise<Array>} A promise that resolves to an array of problems created by the specified author.
 */
const getProblemsByAuthor = async (authorId: string): Promise<any> => {
  logger.log('Attempting to fetch problems for given author id.', { authorId });
  try {
    const problems = await findProblemsByAuthor(authorId);
    logger.log('Successfully fetched problems for given author id', { authorId });
    return problems;
  } catch (error: any) {
    logger.error('Error while fetching problems for given author id', {
      error: error.message,
      authorId,
    });
    throw new Error('Error while fetching my problems');
  }
};

/**
 * Attempts to create a new problem checking first if one with the same name exists.
 * @param {String} userId - The ID of the user creating the problem.
 * @param {String} problemName - The name of the problem to create.
 * @param {Object} sampleProblemData - The sample data for the problem.
 * @returns {Promise<Object>} A promise that resolves to the newly created problem object.
 */
const createProblem = async (userId: string, problemName: string, sampleProblemData: any): Promise<any> => {
  logger.log('Attempting to create a new problem for user:', {userId});
  try {
    const existingProblem = await findProblemByName(problemName);
    if (existingProblem) {
      logger.error('Creation attempt failed: Problem with the same name already exists.', { problemName });
      throw new Error('A problem with the same name already exists.');
    }
    const problemId = await incrementProblemIdCounter();
    const newProblem = await createNewProblem({
      author: userId,
      problemId,
      problemName,
      saved: sampleProblemData,
      published: sampleProblemData,
      isPublished: false,
    });
    logger.log('Successfully created a new problem.', { problemId: newProblem.problemId });
    return newProblem;
  } catch (error: any) {
    logger.error('Error while creating a new problem.', {
      error: error.message,
      problemName,
      authorId: userId,
    });
    throw error;
  }
};

/**
 * Fetches problem data for a given problem ID and author ID.
 * @param {number} problemId - The ID of the problem to fetch.
 * @param {String} authorId - The ID of the author of the problem.
 * @returns {Promise<Object>} A promise that resolves to the problem data object.
 */
const getProblemWithAuthor = async (problemId: number, authorId: string): Promise<any> => {
  logger.log('Attempting to fetch problem data for given problem id and author id.', { problemId, authorId });
  try {
    const problemData = await findProblemByIdAndAuthor(problemId, authorId);
    logger.log('Successfully fetched problem data for given problem id and author id.');
    return problemData;
  } catch (error: any) {
    logger.error('Error while fetching problem data for given ids.', {
      error: error.message,
      problemId,
      authorId,
    });
    throw new Error('Error while fetching problem data');
  }
};


/**
 * Updates problem data for a given problem ID and author ID with provided update data.
 * @param {Number} problemId - The ID of the problem to update.
 * @param {String} authorId - The ID of the author of the problem.
 * @param {Object} updateData - The data to update the problem with.
 * @returns {Promise<Object>} A promise that resolves to the updated problem object.
 */
const saveProblemData = async (problemId: number, authorId: string, updateData: any): Promise<any> => {
  logger.log('Attempting to update problem data for given problem id, author id and updateData.', { problemId, authorId });
  try {
    const savedProblem = await updateProblem(problemId, updateData);
    logger.log('Successfully updating problem data for given problem id, author id and updateData.');
    return savedProblem;
  } catch (error: any) {
    logger.error('Error while updating problem data for given problem id, author id and updateData.', {
      error: error.message,
      problemId,
      authorId,
      updateData,
    });
    throw new Error('Error while updating problem data.');
  }
};

/**
 * Saves and publishes problem data for a given problem ID and author ID with provided update data.
 * @param {Number} problemId - The ID of the problem to save and publish.
 * @param {String} authorId - The ID of the author of the problem.
 * @param {Object} updateData - The data to save and publish the problem with.
 * @returns {Promise<Object>} A promise that resolves to the published problem object.
 */
const saveAndPublishProblemData = async (problemId: number, authorId: string, updateData: any): Promise<any> => {
  logger.log('Attempting to save and publish problem data for given problem id, author id and updateData.', { problemId, authorId });
  try {
    const publishedProblem = await publishProblem(problemId, updateData);
    logger.log('Successfully saved and published problem data for given problem id, author id and updateData.');
    return publishedProblem;
  } catch (error: any) {
    logger.error('Error while saving and publishing problem data for given problem id, author id and updateData.', {
      error: error.message,
      problemId,
      authorId,
      updateData,
    });
    throw new Error('Error while saving and publishing problem data.');
  }
};

export {
  getProblems,
  getProblemById,
  getProblemsByAuthor,
  createProblem,
  getProblemWithAuthor,
  saveProblemData,
  saveAndPublishProblemData,
};;
