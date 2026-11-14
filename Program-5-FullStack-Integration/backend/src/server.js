/**
 * Integrated Express.js Backend Server
 * Roll No: 38 | Dept: AI & DS | CO6
 * Persists data using Sequelize ORM (PostgreSQL on Render / SQLite for local)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, testConnection } = require('./config/db');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'https://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS blocked by server security policy.'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check & Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'Integrated Student Attendance Backend API (CO6)',
    student: {
      rollNo: 38,
      department: 'B.E. AI & DS',
      semester: 'V'
    },
    database: {
      orm: 'Sequelize',
      dialect: sequelize.getDialect(),
      connected: true
    },
    endpoints: {
      attendance: '/api/attendance',
      stats: '/api/attendance/stats'
    }
  });
});

// Mount Attendance Routes
app.use('/api/attendance', attendanceRoutes);

// Database Sync and Server Bootstrap
async function startServer() {
  try {
    await testConnection();
    // Sync models with database tables
    await sequelize.sync();
    console.log('📦 Database models synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 Program 5 Backend Server running on port ${PORT}`);
      console.log(`🔗 Base URL: http://localhost:${PORT}`);
      console.log(`💾 Database Dialect: ${sequelize.getDialect().toUpperCase()}`);
      console.log(`🌐 CORS Allowed Origins: ${allowedOrigins.join(', ')}`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Fatal startup error:', err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
