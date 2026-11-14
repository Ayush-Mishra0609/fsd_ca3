/**
 * Attendance EventEmitter & Audit Logging Module
 * Roll No: 38 | Dept: AI & DS | CO4
 *
 * Demonstrates:
 * - events.EventEmitter for event-driven updates & notifications
 * - fs.createWriteStream for asynchronous stream-based append logging
 * - path module for cross-platform log file destination
 */

const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');

class AttendanceEventEmitter extends EventEmitter {
  constructor() {
    super();

    // Resolve path using path.join
    this.logFilePath = path.join(__dirname, 'logs', 'attendance_events.log');

    // Ensure logs directory exists
    const logsDir = path.dirname(this.logFilePath);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Initialize writable stream with append flag
    this.logStream = fs.createWriteStream(this.logFilePath, {
      flags: 'a',
      encoding: 'utf8'
    });

    this.registerListeners();
  }

  registerListeners() {
    // 1. Attendance Marked Event
    this.on('attendance:marked', (record) => {
      const logMessage = `[${new Date().toISOString()}] [EVENT: MARKED] Student: ${record.name} (Roll: ${record.rollNo}) | Status: ${record.status} | Date: ${record.date}\n`;
      this.writeLog(logMessage);
      console.log(`📢 [EVENT NOTIFICATION] Attendance Recorded: ${record.name} marked as '${record.status}'.`);

      if (record.status === 'Absent') {
        this.emit('attendance:warning', {
          type: 'ABSENTEE_ALERT',
          rollNo: record.rollNo,
          name: record.name,
          message: `Warning: Student ${record.name} (Roll: ${record.rollNo}) has been marked Absent!`
        });
      }
    });

    // 2. Attendance Updated Event
    this.on('attendance:updated', (record) => {
      const logMessage = `[${new Date().toISOString()}] [EVENT: UPDATED] Student: ${record.name} (Roll: ${record.rollNo}) | New Status: ${record.status}\n`;
      this.writeLog(logMessage);
      console.log(`🔄 [EVENT NOTIFICATION] Attendance Updated for ${record.name} -> ${record.status}`);
    });

    // 3. Attendance Deleted Event
    this.on('attendance:deleted', (details) => {
      const logMessage = `[${new Date().toISOString()}] [EVENT: DELETED] Record ID: ${details.id} | Student: ${details.name} (Roll: ${details.rollNo})\n`;
      this.writeLog(logMessage);
      console.log(`🗑️ [EVENT NOTIFICATION] Attendance Record Deleted: ${details.name} (ID: ${details.id})`);
    });

    // 4. Warning / Low Attendance Notification
    this.on('attendance:warning', (warning) => {
      const logMessage = `[${new Date().toISOString()}] [ALERT: WARNING] ${warning.message}\n`;
      this.writeLog(logMessage);
      console.warn(`⚠️ [AUDIT ALERT] ${warning.message}`);
    });
  }

  writeLog(content) {
    if (this.logStream && !this.logStream.destroyed) {
      this.logStream.write(content);
    }
  }

  // Gracefully close stream on shutdown
  close() {
    if (this.logStream) {
      this.logStream.end();
    }
  }
}

// Export singleton instance
const attendanceEmitter = new AttendanceEventEmitter();
module.exports = attendanceEmitter;
