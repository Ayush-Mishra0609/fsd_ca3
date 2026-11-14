/**
 * In-Memory & File-Backed Repository for Program 4
 * Roll No: 38 | Dept: AI & DS | CO5
 */

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'records.json');

// Initial seed data
const initialAttendance = [
  {
    id: 1,
    rollNo: "38",
    name: "Ayush Sharma",
    course: "B.E. AI & DS",
    semester: "V",
    date: "2026-11-14",
    status: "Present",
    remarks: "Completed CO5 Express REST API",
    createdBy: "faculty@university.edu"
  },
  {
    id: 2,
    rollNo: "01",
    name: "Aarav Patel",
    course: "B.E. AI & DS",
    semester: "V",
    date: "2026-11-14",
    status: "Present",
    remarks: "On time",
    createdBy: "faculty@university.edu"
  },
  {
    id: 3,
    rollNo: "12",
    name: "Bhavya Rao",
    course: "B.E. AI & DS",
    semester: "V",
    date: "2026-11-14",
    status: "Absent",
    remarks: "Sick leave",
    createdBy: "faculty@university.edu"
  },
  {
    id: 4,
    rollNo: "24",
    name: "Devansh Mehta",
    course: "B.E. AI & DS",
    semester: "V",
    date: "2026-11-14",
    status: "Late",
    remarks: "Transit delay",
    createdBy: "faculty@university.edu"
  }
];

class Database {
  constructor() {
    this.users = [];
    this.attendance = [...initialAttendance];
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        if (data.attendance) this.attendance = data.attendance;
        if (data.users) this.users = data.users;
      }
    } catch (e) {
      console.warn('Using in-memory database store.');
    }
  }

  persist() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify({
        users: this.users,
        attendance: this.attendance
      }, null, 2), 'utf8');
    } catch (e) {
      // In-memory fallback
    }
  }
}

const db = new Database();
module.exports = db;
