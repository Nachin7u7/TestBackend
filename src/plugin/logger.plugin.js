const winston = require('winston');
require('winston-daily-rotate-file');

const { config } = require('../config');

const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.printf((info) => {
    let customInfo = Object.assign({}, info);
    delete customInfo.timestamp;
    delete customInfo.level;
    delete customInfo.message;
    delete customInfo.service;
    let additionalInfo = Object.keys(customInfo).length ? JSON.stringify(customInfo, null, 4) : '';
    return `${info.timestamp} [${info.level}][${info.service}]: ${info.message} ${additionalInfo}`
  }),
  winston.format.colorize({ all: true })
);

const logsDirectory = config.env === 'development' ? './logs':'/tmp/logs' 

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: `${logsDirectory}/application-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const logger = winston.createLogger({
  level: 'info', // TODO: llevar al env
  format: logFormat,
  transports: [
    new winston.transports.Console({
      level: 'debug', // para dev
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
    dailyRotateFileTransport,
  ],
});

// TODO: for routes move to middleware tier
const expressLoggerMiddleware = (req, res, next) => {
  const { method, url } = req;
  const message = `${method} ${url}`;
  logger.info(message);
  next();
};

module.exports = function buildLogger(service) {
  return {
    log: (message, obj = {}) => {
      logger.info({ message, ...obj, service });
    },
    error: (message, obj = {}) => {
      logger.error({ message, ...obj, service });
    },
  };
};
