/**
 * JWT Authentication Middleware
 * Validates 'Authorization: Bearer <token>' header
 * Decodes user payload and assigns to req.user
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fsd_ca3_super_secret_jwt_key_roll_38';

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Access Denied: Missing Authorization header. Format must be Bearer <token>.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token format. Expected: Bearer <token>'
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired JWT token',
      details: err.message
    });
  }
}

module.exports = authenticateJWT;
