/**
 * Authentication Routes
 * Implements JWT authentication and user registration
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateAuthInput } = require('../middleware/validate');
const authenticateJWT = require('../middleware/auth');

// Public authentication endpoints
router.post('/register', validateAuthInput, authController.register);
router.post('/login', validateAuthInput, authController.login);

// Protected endpoint demonstrating JWT verification
router.get('/profile', authenticateJWT, authController.getProfile);

module.exports = router;
