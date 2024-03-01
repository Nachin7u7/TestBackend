const Problem = require('../models/problem.model');
const Counter = require("../models/counter.model");
const { buildLogger } = require('../plugin');

const logger = buildLogger('problemRepository');

/**
 * Fetches problems based on their published status.
 * @param {Boolean} isPublished - The publication status to filter the problems by.
 * @returns {Promise<Array>} A promise that resolves to an array of problem documents.
 */
const findProblemsByPublished = async (isPublished) => {
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
      isPublished: isPublished,
    });
    throw new Error('Failed to fetch published problems: ' + error.message);
  }
};

/**
 * Fetches a specific problem by its ID and published status.
 * @param {String} problemId - The ID of the problem to fetch.
 * @param {Boolean} isPublished - The published status to match.
 * @returns {Promise<Object>} A promise that resolves to the problem document.
 */
const findProblemByIdAndPublished = async (problemId, isPublished) => {
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

/**
 * Fetches a published problem by its ID.
 * @param {String} problemId - The ID of the problem to fetch.
 * @returns {Promise<Object>} A promise that resolves to the problem document if found.
 */
const findPublishedProblemById = async (problemId) => {
  logger.log('Attempting to fetch problem by id and published status.', {
    problemId: problemId,
  });
  try {
    const query = { problemId, isPublished: true };
    const fields = {
      'published.testcases': 1,
      'published.config': 1,
      'published.checkerCode': 1,
      solvedCount: 1,
      totalSubmissions: 1,
    };
    return await this.db.findOne(query, fields);
  } catch (error) {
    console.error('Error fetching problem from repository:', error);
    throw error;
  }
};

/**
 * Finds problems created by a specific author.
 * @param {String} authorId - The ID of the author whose problems are being sought.
 * @returns {Promise<Array>} A promise that resolves to an array of problems created by the author.
 */
const findProblemsByAuthor = async (authorId) => {
  logger.log('Attempting to find problems by author.');
  try {
    const problems = await Problem.find({ author: authorId }, '_id problemId problemName');
    logger.log('Successfully found problems by author.', { authorId: authorId });
    return problems;
  } catch (error) {
    logger.error('Error while finding problems by author.', { error: error.message, authorId: authorId});
    throw new Error('Failed to find problems by author: ' + error.message);
  }
};

/**
 * Creates a new problem in the database.
 * @param {Object} problemData - The data for the new problem.
 * @returns {Promise<Object>} The saved problem document.
 */
const createNewProblem = async (problemData) => {
  logger.log('Attempting to create a new problem.');
  try {
    const newProblem = new Problem(problemData);
    const savedProblem = await newProblem.save();
    logger.log('Successfully created a new problem.', { problemId: savedProblem._id });
    return savedProblem;
  } catch (error) {
    logger.error('Error while creating a new problem.', { error: error.message });
    throw new Error('Failed to create a new problem: ' + error.message);
  }
};

/**
 * Finds a problem by its ID and author.
 * @param {String} problemId - The ID of the problem.
 * @param {String} authorId - The ID of the author.
 * @returns {Promise<Object>} A promise that resolves to the problem document if found.
 */
const findProblemByIdAndAuthor = async (problemId, authorId) => {
  logger.log('Attempting to find problem by id and author.', { problemId, authorId });
  try {
    const problem = await Problem.findOne({ _id: problemId, author: authorId });
    logger.log('Successfully found problem by id and author.');
    return problem;
  } catch (error) {
    logger.error('Error while finding problem by id and author.', { error: error.message, problemId, authorId });
    throw new Error('Failed to find problem by id and author: ' + error.message);
  }
};

/**
 * Updates a problem document with new data.
 * @param {String} problemId - The ID of the problem to update.
 * @param {Object} updateData - The data to update the problem with.
 * @returns {Promise<Object>} A promise that resolves to the updated problem document.
 */
const updateProblem = async (problemId, updateData) => {
  logger.log('Attempting to update problem.', { problemId: problemId });
  try {
    const updatedProblem = await Problem.findByIdAndUpdate(problemId, updateData, { new: true });
    logger.log('Successfully updated problem.');
    return updatedProblem;
  } catch (error) {
    logger.error('Error while updating problem.', { error: error.message, problemId });
    throw new Error('Failed to update problem: ' + error.message);
  }
};

/**
 * Attempts to find a problem by its name.
 * @param {String} problemName - The name of the problem to find.
 * @returns {Promise<Object>} A promise that resolves to the problem document if found.
 */
const findProblemByName = async (problemName) => {
  logger.log('Attempting to find problem by name.', { problemName: problemName });
  try {
    const problem = await Problem.findOne({ problemName: problemName });
    logger.log('Successfully found problem by name.');
    return problem;
  } catch (error) {
    logger.error('Error while finding problem by name.', { error: error.message, problemName });
    throw new Error('Failed to find problem by name: ' + error.message);
  }
};

/**
 * Increments the problem ID counter in the database.
 * @returns {Promise<Number>} A promise that resolves to the updated sequence number.
 */
const incrementProblemIdCounter = async () => {
  logger.log('Attempting to increment problem id counter.');
  try {
    const counterUpdate = await Counter.findByIdAndUpdate(
        { _id: "problemId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    logger.log('Successfully incremented problem id counter.', { seq: counterUpdate.seq });
    return counterUpdate.seq;
  } catch (error) {
    logger.error('Error while incrementing problem id counter.', { error: error.message });
    throw new Error('Failed to increment problem id counter: ' + error.message);
  }
};

/**
 * Publishes a problem by updating its document with publication data.
 * @param {String} problemId - The ID of the problem to publish.
 * @param {Object} updateData - The publication data to update the problem with.
 * @returns {Promise<Object>} A promise that resolves to the published problem document.
 */
const publishProblem = async (problemId, updateData) => {
  logger.log('Attempting to publish problem.', { problemId });
  try {
    const publishedProblem = await Problem.findByIdAndUpdate(
        problemId,
        { $set: updateData },
        { new: true }
    );
    logger.log('Successfully published problem.');
    return publishedProblem;
  } catch (error) {
    logger.error('Error while publishing problem.', { error: error.message, problemId });
    throw new Error('Failed to publish problem: ' + error.message);
  }
};

module.exports = {
  findProblemsByPublished,
  findProblemByIdAndPublished,
  findPublishedProblemById,
  findProblemsByAuthor,
  findProblemByIdAndAuthor,
  updateProblem,
  findProblemByName,
  createNewProblem,
  publishProblem,
  incrementProblemIdCounter
};
