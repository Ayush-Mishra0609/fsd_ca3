/**
 * Database Seed Script for Program 5
 * Populates sample records into PostgreSQL / SQLite
 */

require('dotenv').config();
const { sequelize } = require('./config/db');
const Attendance = require('./models/Attendance');

const sampleData = [
  {
    rollNo: "38",
    name: "Ayush Sharma",
    course: "B.E. AI & DS",
    semester: "Semester V",
    date: new Date().toISOString().split('T')[0],
    status: "Present",
    remarks: "Full Stack Integration assessment complete"
  },
  {
    rollNo: "01",
    name: "Aarav Patel",
    course: "B.E. AI & DS",
    semester: "Semester V",
    date: new Date().toISOString().split('T')[0],
    status: "Present",
    remarks: "Lab practical attendance"
  },
  {
    rollNo: "12",
    name: "Bhavya Rao",
    course: "B.E. AI & DS",
    semester: "Semester V",
    date: new Date().toISOString().split('T')[0],
    status: "Absent",
    remarks: "Medical certificate submitted"
  },
  {
    rollNo: "24",
    name: "Devansh Mehta",
    course: "B.E. AI & DS",
    semester: "Semester V",
    date: new Date().toISOString().split('T')[0],
    status: "Late",
    remarks: "Delayed by 10 mins"
  },
  {
    rollNo: "45",
    name: "Ishita Verma",
    course: "B.E. AI & DS",
    semester: "Semester V",
    date: new Date().toISOString().split('T')[0],
    status: "Present",
    remarks: "Excellent attendance record"
  }
];

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log('🔄 Database table recreated.');

    await Attendance.bulkCreate(sampleData);
    console.log(`✅ Seeded ${sampleData.length} records into the database successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
