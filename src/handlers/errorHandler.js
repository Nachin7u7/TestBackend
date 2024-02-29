const { HTTP_STATUS } = require('../constants');

const notFound = (req, res, next) => {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: "Api url doesn't exist ",
  });
};

const catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch((error) => {
      if (error.name == 'ValidationError') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          result: null,
          message: 'Required fields are not supplied',
          controller: fn.name,
          error: error,
        });
      } else {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          result: null,
          message: error.message,
          controller: fn.name,
          error: error,
        });
      }
    });
  };
};

module.exports = { notFound, catchErrors };
