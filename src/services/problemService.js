const router = require("express").Router();
const { config } = require("dotenv");
const userAuth = require("../middlewares/userAuth");
const User = require("../models/user.model");
const Problem = require("../repositories/problemRepository");
const Submission = require("../models/submission.model");
const axios = require("axios");

const getProblems = async () => {
  try {
    let problemsList = await Problem.find(
      {
        isPublished: true,
      },
      {
        _id: 1,
        problemId: 1,
        problemName: 1,
        "published.config": 1,
        solvedCount: 1,
        totalSubmissions: 1,
      }
    );
    problemsList = JSON.parse(JSON.stringify(problemsList));
    for (let i = 0; i < problemsList.length; i++) {
      if (problemsList[i].totalSubmissions >= 1)
        problemsList[i].acceptance =
          (problemsList[i].solvedCount / problemsList[i].totalSubmissions) *
          100;
      else problemsList[i].acceptance = 0;
    }
    return problemsList;
  } catch (err) {
    throw err;
  }
};

const getProblemById = async (req) => {
  try {
    const problemId = req.query.problemId;
    console.log("🚀 ~ getProblemById ~ problemId:", problemId)
    const problem = await Problem.findOne(
      {
        problemId: problemId,
        isPublished: true,
      },
      {
        _id: 1,
        problemId: 1,
        problemName: 1,
        published: 1,
      }
    );
    return problem;
  } catch (err) {
    console.log("🚀 ~ getProblemById ~ err:", err)
    throw err;
  }
};

const problemService = { getProblems, getProblemById };

module.exports = problemService;
