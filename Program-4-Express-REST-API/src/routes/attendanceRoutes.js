/**
 * Student Attendance REST API Routes
 * Implements CRUD routes with validation, logging & JWT protection
 */

const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { validateAttendanceInput } = require('../middleware/validate');
const authenticateJWT = require('../middleware/auth');

// Public endpoints
router.get('/', attendanceController.getAllAttendance);
router.get('/stats', attendanceController.getAttendanceStats);
router.get('/:id', attendanceController.getAttendanceById);

// Protected endpoints (Require valid JWT Bearer token)
router.post('/', authenticateJWT, validateAttendanceInput, attendanceController.createAttendance);
router.put('/:id', authenticateJWT, validateAttendanceInput, attendanceController.updateAttendance);
router.delete('/:id', authenticateJWT, attendanceController.deleteAttendance);

module.exports = router;
