import mongoose from 'mongoose';
import { buildLogger } from '../plugin'; // Asegúrate de que la importación coincida con la forma en que exportas en TypeScript

const logger = buildLogger('db-shutdown');

const gracefulShutdown = (exitCode: number = 0): void => {
  mongoose.connection.close(() => {
    logger.log('MongoDB connection is disconnected through app termination');
    process.exit(exitCode);
  });
};

export default gracefulShutdown;
