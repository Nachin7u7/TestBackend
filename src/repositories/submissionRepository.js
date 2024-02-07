const mongoose = require("mongoose");
const submissionSchema = require("../models/submission.model")

const Submission = mongoose.model("Submission", submissionSchema);
module.exports = Submission;