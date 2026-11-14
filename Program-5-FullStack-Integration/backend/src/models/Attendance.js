/**
 * Sequelize Attendance Model
 * Roll No: 38 | Dept: AI & DS | CO6
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  rollNo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Roll number cannot be empty' }
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Student name cannot be empty' },
      len: { args: [3, 100], msg: 'Name must be between 3 and 100 characters' }
    }
  },
  course: {
    type: DataTypes.STRING,
    defaultValue: 'B.E. AI & DS'
  },
  semester: {
    type: DataTypes.STRING,
    defaultValue: 'Semester V'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('Present', 'Late', 'Absent'),
    allowNull: false,
    defaultValue: 'Present'
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'General Attendance'
  }
}, {
  tableName: 'student_attendance',
  timestamps: true
});

module.exports = Attendance;
