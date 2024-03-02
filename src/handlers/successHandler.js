const { HTTP_STATUS } = require('../constants');

const sendOkResponse = (res, data, message, statusCode = HTTP_STATUS.OK) => {
  res.status(statusCode).json({
    success: true,
    result: data,
    message,
  });
};

const sendCreatedResponse = (res, message, data) => {
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    result: data,
    message,
  });
};

module.exports = {
  sendOkResponse,
  sendCreatedResponse,
};
