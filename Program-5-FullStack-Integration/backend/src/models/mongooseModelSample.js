/**
 * MongoDB Mongoose Schema Model Reference
 * Provided for academic completeness (PostgreSQL with Sequelize OR MongoDB with Mongoose)
 */

/*
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: [true, 'Roll number is required'],
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters']
  },
  course: {
    type: String,
    default: 'B.E. AI & DS'
  },
  semester: {
    type: String,
    default: 'Semester V'
  },
  date: {
    type: String,
    required: true,
    default: () => new Date().toISOString().split('T')[0]
  },
  status: {
    type: String,
    enum: ['Present', 'Late', 'Absent'],
    default: 'Present'
  },
  remarks: {
    type: String,
    default: 'General Attendance'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);
*/

module.exports = {
  description: 'Mongoose schema sample for MongoDB persistence option'
};
