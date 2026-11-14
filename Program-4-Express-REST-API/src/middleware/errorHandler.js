/**
 * Centralized Error Handling Middleware
 * Catches all unhandled synchronous/asynchronous errors in Express routes
 */

function errorHandler(err, req, res, next) {
  console.error('🚨 Centralized Error Handler Caught:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    error: message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
}

module.exports = errorHandler;
