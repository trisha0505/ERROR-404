const logger = require('../utils/logger');
//const errorHandler = require('./middlewares/errorHandler');

function errorHandler(err, req, res, next) {
  logger.error(err.message, { error: err, stack: err.stack });

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
}

module.exports = errorHandler;
