# Program 3: Node.js Core Server-Side Utility for Student Attendance (without Express)

- **Course**: Full Stack Development / Web Development
- **Degree / Branch**: B.E. (Artificial Intelligence & Data Science) | Semester V
- **Student Roll No**: 38
- **Course Outcome Covered**: **CO4** (Node.js Server Architecture, File System `fs`, `path` module, `Streams`, and `EventEmitter`)

---

## 📋 Task Description
> Create a Node.js server-side utility for student attendance. Use the File System and Path modules to store and retrieve records, and use Streams or EventEmitter to process updates or notifications. Expose functionality through a basic HTTP server without Express.

---

## 🌟 Architecture & Core Concept Implementation

1. **Native HTTP Server (`http` Module)**:
   - Built exclusively with Node's built-in `http.createServer()` without any third-party web frameworks like Express.
   - Handcrafted request router, query parameter parsing via WHATWG `URL` class, incoming chunk stream parser (`parseJsonBody`), and CORS headers.

2. **File System (`fs` & `fs/promises`) and `path` Module**:
   - Stores all attendance entries in `data/attendance_records.json`.
   - Uses `path.join(__dirname, 'data', 'attendance_records.json')` for cross-platform OS file resolution.
   - Uses asynchronous promise-based file operations (`fsPromises.readFile`, `fsPromises.writeFile`, `fsPromises.mkdir`).

3. **Event-Driven Architecture (`EventEmitter`)**:
   - `attendanceEmitter.js` extends `events.EventEmitter`.
   - Listens to and triggers life-cycle events:
     - `attendance:marked`: Fired when a student record is added.
     - `attendance:updated`: Fired when an existing status is modified.
     - `attendance:deleted`: Fired when a record is deleted.
     - `attendance:warning`: Emits absentee alerts when a student is recorded absent.

4. **Node.js Streams (`stream.Readable` & `fs.createReadStream` / `fs.createWriteStream`)**:
   - **Writable Stream (`fs.createWriteStream`)**: Persists an ongoing append-only audit trail in `logs/attendance_events.log`.
   - **Readable Stream (`fs.createReadStream`)**: Streams server logs directly into client HTTP responses via `.pipe(res)` for `GET /api/attendance/logs`.
   - **Custom Stream Pipeline**: Generates and pipes CSV data chunks on-the-fly for `GET /api/attendance/export`.

---

## 📂 Project Directory Structure

```
Program-3-Nodejs-Core-Server/
├── server.js                # Core HTTP server, routing & stream pipelines
├── attendanceEmitter.js     # Custom EventEmitter and append-stream logger
├── package.json             # NPM metadata and scripts (0 external dependencies)
├── test-client.js           # Automated test client verifying all requirements
├── data/
│   └── attendance_records.json # Persistent JSON database file
├── logs/
│   └── attendance_events.log   # Streamed audit log of all system events
└── README.md                # Comprehensive documentation
```

---

## 📡 API Endpoints Reference

| HTTP Method | Route Endpoint | Purpose / Functionality | Architectural Feature Used |
|---|---|---|---|
| `GET` | `/` | Web dashboard & documentation | Native HTTP server & HTML response |
| `GET` | `/api/attendance` | Retrieve all student records | `fs/promises` & `path` module |
| `GET` | `/api/attendance/stats` | Real-time attendance percentage & counts | Analytical aggregation |
| `GET` | `/api/attendance/export` | Download CSV attendance file | **Streams** (`Readable.pipe(res)`) |
| `GET` | `/api/attendance/logs` | View real-time audit log file | **Streams** (`fs.createReadStream`) |
| `POST` | `/api/attendance` | Add new student attendance record | Stream parsing, `fs.writeFile`, `EventEmitter` |
| `PUT` | `/api/attendance?id=:id` | Update attendance details | `fs.writeFile`, `attendance:updated` event |
| `DELETE` | `/api/attendance?id=:id` | Remove student record | `fs.writeFile`, `attendance:deleted` event |

---

## 🚀 How to Run

### Step 1: Start the Core Server
```bash
cd Program-3-Nodejs-Core-Server
node server.js
```
The server will initialize on `http://localhost:4000`.

### Step 2: Run the Automated Test Suite
In another terminal (or directly):
```bash
node test-client.js
```
This script will test every HTTP endpoint, verify streams, validate file writes, and log EventEmitter events to the terminal console!
