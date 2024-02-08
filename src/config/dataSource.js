const mongoose = require("mongoose");
const { mongoDB } = require("../config/config");
// --------------- Connect to MongoDB ---------------
const mongoConnectionInit = () => {
  const uri = mongoDB.mongoUri;
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "test", // Replace with your actual database name if different
    })
    .then(() => {
      console.log("MongoDB database connection established successfully");
    })
    .catch((err) => console.error(err));
};

module.exports = mongoConnectionInit;
