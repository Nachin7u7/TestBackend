const mongoose = require("mongoose");
const userSchema = require("../models/user.model");

const User = mongoose.model("User", userSchema);
module.exports = User;