/**
 * Database Configuration using Sequelize ORM
 * Supports PostgreSQL (via DATABASE_URL on Render / Production)
 * and SQLite for instant zero-configuration local development.
 */

const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

if (process.env.DATABASE_URL) {
  // Production PostgreSQL Database (e.g., Render Managed PostgreSQL)
  console.log('🐘 Connecting to PostgreSQL via Sequelize...');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  });
} else {
  // Local zero-setup SQLite fallback
  const sqliteStoragePath = path.join(__dirname, '..', '..', 'database.sqlite');
  console.log(`📁 Connecting to Local SQLite Database via Sequelize at: ${sqliteStoragePath}`);
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: sqliteStoragePath,
    logging: false
  });
}

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully via Sequelize ORM.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  }
}

module.exports = {
  sequelize,
  testConnection
};
