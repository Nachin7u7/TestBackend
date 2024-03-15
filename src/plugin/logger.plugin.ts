import winston from 'winston';
import 'winston-daily-rotate-file';
import { config } from '../config';

interface CustomInfo {
  [key: string]: any;
}

const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.printf((info: winston.Logform.TransformableInfo) => {
    let customInfo: CustomInfo = Object.assign({}, info);
    delete customInfo.timestamp;
    delete customInfo.level;
    delete customInfo.message;
    delete customInfo.service;
    let additionalInfo = Object.keys(customInfo).length ? JSON.stringify(customInfo, null, 4) : '';
    return `${info.timestamp} [${info.level}][${info.service}]: ${info.message} ${additionalInfo}`;
  }),
  winston.format.colorize({ all: true })
);

const logsDirectory: string = config.env === 'development' ? './logs' : '/tmp/logs';

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: `${logsDirectory}/application-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
    dailyRotateFileTransport,
  ],
});

const expressLoggerMiddleware = (req: any, res: any, next: () => void) => {
  const { method, url } = req;
  const message: string = `${method} ${url}`;
  logger.info(message);
  next();
};

const buildLogger = (service: string) => {
  return {
    log: (message: string, obj: CustomInfo = {}) => {
      logger.info({ message, ...obj, service });
    },
    error: (message: string, obj: CustomInfo = {}) => {
      logger.error({ message, ...obj, service });
    },
  };
};

export { buildLogger, expressLoggerMiddleware };
