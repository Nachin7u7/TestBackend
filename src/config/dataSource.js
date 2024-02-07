const mongoose = require("mongoose");

// --------------- Connect to MongoDB ---------------
const mongoConnectionInit = () => {
  const uri =
    "mongodb+srv://andercaymi:Standbyme1@cluster0.ngncwfr.mongodb.net/?retryWrites=true&w=majority";
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

module.exports = mongoConnectionInit
