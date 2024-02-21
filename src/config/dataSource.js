const mongoose = require('mongoose');
const config = require('../config/config');
const { buildLogger } = require('../plugin');
const gracefulShutdown = require('./db.shutdown');

const { mongoDB } = config;
const logger = buildLogger('dataSource.js');

const mongoConnectionInit = async () => {
  const { uri, database } = mongoDB;

  logger.log(
    `Attempting to connect to MongoDB at ${uri.replace(
      /\/\/.+@/,
      '//****:****@'
    )}`
  );

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: database,
    });
    logger.log(`MongoDB connected to database: "${database}"`);
  } catch (err) {
    logger.error('MongoDB connection error:', err.message);
    process.emit('dbConnectionError', err);
  }
};

mongoose.connection.on('connected', () =>
  logger.log('Mongoose connection open')
);
mongoose.connection.on('error', (err) =>
  logger.error(`Mongoose connection error: ${err.message}`)
);
mongoose.connection.on('disconnected', () =>
  logger.log('Mongoose connection disconnected')
);

process
  .on('SIGINT', () => gracefulShutdown(0))
  .on('SIGTERM', () => gracefulShutdown(0));

module.exports = mongoConnectionInit;
