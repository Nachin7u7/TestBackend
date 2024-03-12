import mongoose from 'mongoose';
import config from './config'; 
import { buildLogger } from '../plugin'; 
import gracefulShutdown from './db.shutdown';

const { mongoDB } = config;
const logger = buildLogger('dataSource.js');

const mongoConnectionInit = async (): Promise<void> => {
  const { uri, database } = mongoDB;

  if(!uri){
    logger.error('MONGO URI not defined')
    throw Error('Bad Connection Attempt')
  }

  logger.log(
    `Attempting to connect to MongoDB at ${uri.replace(
      /\/\/.+@/,
      '//****:****@'
    )}`
  );

  try {
    await mongoose.connect(uri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      dbName: database,
    });
    logger.log(`MongoDB connected to database: "${database}"`);
  } catch (err: any) {
    logger.error('MongoDB connection error:', err.message);
    // process.emit('dbConnectionError', err);
  }
};

mongoose.connection.on('connected', () =>
  logger.log('Mongoose connection open')
);
mongoose.connection.on('error', (err: Error) =>
  logger.error(`Mongoose connection error: ${err.message}`)
);
mongoose.connection.on('disconnected', () =>
  logger.log('Mongoose connection disconnected')
);

mongoose.set('strictQuery', false);

process
  .on('SIGINT', () => gracefulShutdown(0))
  .on('SIGTERM', () => gracefulShutdown(0));

export default mongoConnectionInit;
