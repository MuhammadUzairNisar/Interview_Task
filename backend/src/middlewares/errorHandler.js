const { ValidationError } = require('sequelize');
const env = require('../config/env');

// eslint-disable-next-line no-unused-vars
module.exports = (err, _req, res, _next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: { message: 'Validation failed', details: err.errors.map((e) => ({ field: e.path, message: e.message })) },
    });
  }

  const statusCode = err.statusCode || 500;
  if (statusCode >= 500) console.error(err);

  res.status(statusCode).json({
    error: {
      message: statusCode >= 500 && env.nodeEnv === 'production' ? 'Internal server error' : err.message,
      ...(err.details && { details: err.details }),
    },
  });
};
