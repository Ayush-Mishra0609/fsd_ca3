/**
 * Node.js Core Server for Student Attendance (without Express)
 * Roll No: 38 | Dept: AI & DS | Course Outcome: CO4
 *
 * Demonstrates:
 * - Native 'http' module (createServer, routing, request/response lifecycle)
 * - 'fs' and 'fs/promises' for file storage and reading
 * - 'path' module for directory and path resolution
 * - Streams ('stream.Readable', 'fs.createReadStream') for streaming responses
 * - 'EventEmitter' via attendanceEmitter for asynchronous audit logs & alerts
 */

const http = require('http');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { Readable } = require('stream');
const attendanceEmitter = require('./attendanceEmitter');

const PORT = process.env.PORT || 4000;
const DATA_FILE_PATH = path.join(__dirname, 'data', 'attendance_records.json');
const LOGS_FILE_PATH = path.join(__dirname, 'logs', 'attendance_events.log');

// Ensure data directory and file exist
async function initStorage() {
  const dataDir = path.dirname(DATA_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    await fsPromises.mkdir(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE_PATH)) {
    const defaultData = [
      { id: 1, rollNo: "38", name: "Ayush Sharma", course: "B.E. AI & DS", semester: "V", date: "2026-11-14", status: "Present", remarks: "Lab completed" },
      { id: 2, rollNo: "01", name: "Aarav Patel", course: "B.E. AI & DS", semester: "V", date: "2026-11-14", status: "Present", remarks: "Class active" },
      { id: 3, rollNo: "12", name: "Bhavya Rao", course: "B.E. AI & DS", semester: "V", date: "2026-11-14", status: "Absent", remarks: "Sick leave" },
      { id: 4, rollNo: "24", name: "Devansh Mehta", course: "B.E. AI & DS", semester: "V", date: "2026-11-14", status: "Late", remarks: "Delayed 15m" }
    ];
    await fsPromises.writeFile(DATA_FILE_PATH, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

// Helper: Read records from JSON file
async function readRecordsFromFile() {
  const fileContent = await fsPromises.readFile(DATA_FILE_PATH, 'utf8');
  return JSON.parse(fileContent || '[]');
}

// Helper: Save records to JSON file
async function saveRecordsToFile(records) {
  await fsPromises.writeFile(DATA_FILE_PATH, JSON.stringify(records, null, 2), 'utf8');
}

// Helper: Parse incoming request body stream
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(new Error('Malformed JSON payload'));
      }
    });
    req.on('error', err => reject(err));
  });
}

// Helper: Standardized JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // Parse URL & Query params
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  try {
    // -------------------------------------------------------------
    // Route 1: GET / (HTML Status Overview)
    // -------------------------------------------------------------
    if (pathname === '/' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Node.js Core Attendance Server | Roll 38</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; background: #f8fafc; color: #1e293b; }
            .card { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom: 20px; border: 1px solid #e2e8f0; }
            h1 { color: #2563eb; margin-top: 0; }
            .badge { background: #dbeafe; color: #1d4ed8; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 0.85rem; }
            code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
            ul { padding-left: 20px; }
            li { margin-bottom: 8px; }
            a { color: #2563eb; text-decoration: none; font-weight: 500; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">B.E. AI & DS &bull; Semester V &bull; Roll No: 38</span>
            <h1>Node.js Core Server-Side Utility</h1>
            <p>Practical Program 3 &mdash; Implemented using pure Node.js <strong>without Express</strong> (CO4).</p>
            <p>Demonstrating: <code>http</code> server, <code>fs</code> and <code>path</code> file operations, <code>EventEmitter</code>, and <code>Streams</code>.</p>
          </div>

          <div class="card">
            <h3>Available REST API Endpoints</h3>
            <ul>
              <li><a href="/api/attendance" target="_blank"><code>GET /api/attendance</code></a> &mdash; Retrieve all records stored via File System</li>
              <li><a href="/api/attendance/stats" target="_blank"><code>GET /api/attendance/stats</code></a> &mdash; Compute attendance rates & stats</li>
              <li><a href="/api/attendance/export" target="_blank"><code>GET /api/attendance/export</code></a> &mdash; <strong>Streams</strong> CSV export download</li>
              <li><a href="/api/attendance/logs" target="_blank"><code>GET /api/attendance/logs</code></a> &mdash; <strong>Streams</strong> real-time audit log file</li>
              <li><code>POST /api/attendance</code> &mdash; Add new student record (triggers EventEmitter)</li>
              <li><code>PUT /api/attendance?id=&lt;id&gt;</code> &mdash; Update existing attendance record</li>
              <li><code>DELETE /api/attendance?id=&lt;id&gt;</code> &mdash; Delete attendance record</li>
            </ul>
          </div>
        </body>
        </html>
      `);
      return;
    }

    // -------------------------------------------------------------
    // Route 2: GET /api/attendance (Read Records using fs and path)
    // -------------------------------------------------------------
    if (pathname === '/api/attendance' && req.method === 'GET') {
      const records = await readRecordsFromFile();
      
      // Optional query filtering
      const statusFilter = searchParams.get('status');
      let responseData = records;
      if (statusFilter) {
        responseData = records.filter(r => r.status.toLowerCase() === statusFilter.toLowerCase());
      }

      sendJson(res, 200, {
        success: true,
        count: responseData.length,
        totalInStore: records.length,
        data: responseData
      });
      return;
    }

    // -------------------------------------------------------------
    // Route 3: GET /api/attendance/stats (Calculated Summary)
    // -------------------------------------------------------------
    if (pathname === '/api/attendance/stats' && req.method === 'GET') {
      const records = await readRecordsFromFile();
      const total = records.length;
      const present = records.filter(r => r.status === 'Present').length;
      const late = records.filter(r => r.status === 'Late').length;
      const absent = records.filter(r => r.status === 'Absent').length;
      const attendanceRate = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 0;

      sendJson(res, 200, {
        success: true,
        stats: {
          totalRecords: total,
          presentCount: present,
          lateCount: late,
          absentCount: absent,
          attendanceRatePercentage: `${attendanceRate}%`
        }
      });
      return;
    }

    // -------------------------------------------------------------
    // Route 4: GET /api/attendance/export (Streams: CSV streaming response)
    // -------------------------------------------------------------
    if (pathname === '/api/attendance/export' && req.method === 'GET') {
      const records = await readRecordsFromFile();
      
      res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="attendance_export_roll38.csv"',
        'Access-Control-Allow-Origin': '*'
      });

      // Stream CSV generation using Readable stream
      const csvStream = new Readable({
        read() {
          this.push('ID,Roll No,Student Name,Course,Semester,Date,Status,Remarks\n');
          for (const r of records) {
            this.push(`${r.id},"${r.rollNo}","${r.name}","${r.course}","${r.semester}","${r.date}","${r.status}","${r.remarks || ''}"\n`);
          }
          this.push(null); // Signal EOF
        }
      });

      csvStream.pipe(res);
      return;
    }

    // -------------------------------------------------------------
    // Route 5: GET /api/attendance/logs (Streams: fs.createReadStream)
    // -------------------------------------------------------------
    if (pathname === '/api/attendance/logs' && req.method === 'GET') {
      if (!fs.existsSync(LOGS_FILE_PATH)) {
        sendJson(res, 404, { success: false, message: 'No event logs generated yet.' });
        return;
      }

      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });

      // Stream file directly to client response
      const logStream = fs.createReadStream(LOGS_FILE_PATH, { encoding: 'utf8' });
      logStream.pipe(res);
      return;
    }

    // -------------------------------------------------------------
    // Route 6: POST /api/attendance (Store Record + EventEmitter)
    // -------------------------------------------------------------
    if (pathname === '/api/attendance' && req.method === 'POST') {
      const payload = await parseJsonBody(req);

      // Validation
      if (!payload.rollNo || !payload.name) {
        sendJson(res, 400, {
          success: false,
          error: 'Validation failed: rollNo and name are required.'
        });
        return;
      }

      const validStatuses = ['Present', 'Late', 'Absent'];
      const status = validStatuses.includes(payload.status) ? payload.status : 'Present';

      const records = await readRecordsFromFile();
      const newRecord = {
        id: Date.now(),
        rollNo: String(payload.rollNo).trim(),
        name: String(payload.name).trim(),
        course: payload.course || 'B.E. AI & DS',
        semester: payload.semester || 'V',
        date: payload.date || new Date().toISOString().split('T')[0],
        status: status,
        remarks: payload.remarks || 'Recorded via Core HTTP Server'
      };

      records.push(newRecord);
      await saveRecordsToFile(records);

      // Trigger EventEmitter notification
      attendanceEmitter.emit('attendance:marked', newRecord);

      sendJson(res, 201, {
        success: true,
        message: 'Attendance recorded successfully.',
        data: newRecord
      });
      return;
    }

    // -------------------------------------------------------------
    // Route 7: PUT /api/attendance?id=... (Update Record + EventEmitter)
    // -------------------------------------------------------------
    if (pathname === '/api/attendance' && req.method === 'PUT') {
      const idParam = searchParams.get('id');
      if (!idParam) {
        sendJson(res, 400, { success: false, error: 'Query parameter ?id=<number> is required.' });
        return;
      }

      const id = parseInt(idParam, 10);
      const payload = await parseJsonBody(req);
      const records = await readRecordsFromFile();
      const index = records.findIndex(r => r.id === id);

      if (index === -1) {
        sendJson(res, 404, { success: false, error: `Record with ID ${id} not found.` });
        return;
      }

      // Update fields
      records[index] = {
        ...records[index],
        ...payload,
        id: records[index].id // Preserve immutable ID
      };

      await saveRecordsToFile(records);

      // Trigger EventEmitter notification
      attendanceEmitter.emit('attendance:updated', records[index]);

      sendJson(res, 200, {
        success: true,
        message: `Record with ID ${id} updated successfully.`,
        data: records[index]
      });
      return;
    }

    // -------------------------------------------------------------
    // Route 8: DELETE /api/attendance?id=... (Delete Record + EventEmitter)
    // -------------------------------------------------------------
    if (pathname === '/api/attendance' && req.method === 'DELETE') {
      const idParam = searchParams.get('id');
      if (!idParam) {
        sendJson(res, 400, { success: false, error: 'Query parameter ?id=<number> is required.' });
        return;
      }

      const id = parseInt(idParam, 10);
      const records = await readRecordsFromFile();
      const targetRecord = records.find(r => r.id === id);

      if (!targetRecord) {
        sendJson(res, 404, { success: false, error: `Record with ID ${id} not found.` });
        return;
      }

      const filtered = records.filter(r => r.id !== id);
      await saveRecordsToFile(filtered);

      // Trigger EventEmitter notification
      attendanceEmitter.emit('attendance:deleted', {
        id: targetRecord.id,
        rollNo: targetRecord.rollNo,
        name: targetRecord.name
      });

      sendJson(res, 200, {
        success: true,
        message: `Record with ID ${id} deleted successfully.`,
        deletedRecord: targetRecord
      });
      return;
    }

    // 404 Not Found for unhandled paths
    sendJson(res, 404, {
      success: false,
      error: `Endpoint '${pathname}' with method ${req.method} does not exist.`
    });

  } catch (error) {
    console.error('Server execution error:', error);
    sendJson(res, 500, {
      success: false,
      error: 'Internal Server Error',
      details: error.message
    });
  }
});

// Initialize storage and launch server
initStorage().then(() => {
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Node.js Core Server running at: http://localhost:${PORT}`);
    console.log(`👤 Student Roll No: 38 | Dept: AI & DS | CO4`);
    console.log(`📦 Storage File: ${DATA_FILE_PATH}`);
    console.log(`📜 Event Stream Log: ${LOGS_FILE_PATH}`);
    console.log(`=======================================================`);
  });
}).catch(err => {
  console.error('Failed to initialize server storage:', err);
});

module.exports = server;
