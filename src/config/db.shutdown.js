const mongoose = require('mongoose');
const { buildLogger } = require('../plugin');

const logger = buildLogger('db-shutdown');

const gracefulShutdown = (exitCode = 0) => {
  mongoose.connection.close(() => {
    logger.log('MongoDB connection is disconnected through app termination');
    process.exit(exitCode);
  });
};

module.exports = gracefulShutdown;
