/**
 * Express.js REST API Server
 * Subject: Full Stack Development (B.E. AI & DS | Sem V)
 * Roll No: 38 | Course Outcome: CO5
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Built-in & Third-Party Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Request Logging Middleware
app.use(requestLogger);

// Base Documentation Route
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'Express.js Student Attendance REST API',
    assignment: 'FSD Practical Program 4 (CO5)',
    student: {
      rollNo: 38,
      department: 'B.E. Artificial Intelligence and Data Science',
      semester: 'V'
    },
    features: [
      'Full CRUD routes (GET, POST, PUT, DELETE)',
      'Custom request logging middleware',
      'Input validation middleware',
      'Centralized error handling middleware',
      'JWT Authentication with bcrypt password hashing',
      'Protected routes requiring Bearer Token'
    ],
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile [Protected]'
      },
      attendance: {
        getAll: 'GET /api/attendance',
        getStats: 'GET /api/attendance/stats',
        getById: 'GET /api/attendance/:id',
        create: 'POST /api/attendance [Protected]',
        update: 'PUT /api/attendance/:id [Protected]',
        delete: 'DELETE /api/attendance/:id [Protected]'
      }
    }
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

// 404 Route Handler for undefined endpoints
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware (must be registered last)
app.use(errorHandler);

// Start Server if not imported by tests
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Express.js REST API Server running on port ${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}`);
    console.log(`👤 Roll No: 38 | Dept: AI & DS | CO5`);
    console.log(`🛡️ JWT & Bcrypt Protected Routes Active`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
