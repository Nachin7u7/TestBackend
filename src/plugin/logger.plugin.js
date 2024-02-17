const winston = require('winston');
require('winston-daily-rotate-file');

const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message} ${info.service}`
  ),
  winston.format.colorize({ all: true })
);

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: './logs/application-%DATE%.log',
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
    log: (message) => {
      logger.info({ message, service });
    },
    error: (message) => {
      logger.error({ message, service });
    },
  };
};
