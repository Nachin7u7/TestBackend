const mongoose = require("mongoose");
const problemSchema = require("../models/problem.model")

const Problem = mongoose.model("Problem", problemSchema);
module.exports = Problem;