const Problem = require("../models/problem.model");
const Counter = require("../models/counter.model");

const findProblemsByAuthor = async (authorId) => {
    return Problem.find({ author: authorId }, '_id problemId problemName');
};

const createNewProblem = async (problemData) => {
    const newProblem = new Problem(problemData);
    return newProblem.save();
};

const findProblemByIdAndAuthor = async (problemId, authorId) => {
    return Problem.findOne({ _id: problemId, author: authorId });
};

const updateProblem = async (problemId, updateData) => {
    return Problem.findByIdAndUpdate(problemId, updateData, { new: true });
};

const findProblemByName = async (problemName) => {
    return Problem.findOne({ problemName: problemName });
};

const incrementProblemIdCounter = async () => {
    const counterUpdate = await Counter.findByIdAndUpdate(
        { _id: "problemId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counterUpdate.seq;
};

const publishProblem = async (problemId, updateData) => {
    return Problem.findByIdAndUpdate(
        problemId,
        { $set: updateData },
        { new: true }
    );
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
