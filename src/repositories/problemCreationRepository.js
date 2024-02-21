const Problem = require("../models/problem.model");
const Counter = require("../models/counter.model");
const { buildLogger } = require('../plugin');

const logger = buildLogger('problemCreationRepository');
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
    findProblemsByAuthor,
    createNewProblem,
    findProblemByIdAndAuthor,
    updateProblem,
    findProblemByName,
    incrementProblemIdCounter,
    publishProblem,
};
