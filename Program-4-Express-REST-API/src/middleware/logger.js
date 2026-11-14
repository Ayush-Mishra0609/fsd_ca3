/**
 * Request Logging Middleware
 * Logs HTTP Method, Request Path, Status Code, and Elapsed Time (ms)
 */

function requestLogger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Hook into res.on('finish') to capture status after handling
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    
    let colorPrefix = '\x1b[32m'; // Green (2xx)
    if (statusCode >= 400 && statusCode < 500) colorPrefix = '\x1b[33m'; // Yellow (4xx)
    if (statusCode >= 500) colorPrefix = '\x1b[31m'; // Red (5xx)

    console.log(
      `[${timestamp}] ${colorPrefix}${req.method}\x1b[0m ${req.originalUrl || req.url} ` +
      `${colorPrefix}${statusCode}\x1b[0m - ${duration}ms`
    );
  });

  next();
}

module.exports = requestLogger;
