# FULL STACK DEVELOPMENT &mdash; WEB DEVELOPMENT
## CAI PRACTICAL JOURNAL

- **Student Name**: Ayush Kumar Mishra
- **Roll No.**: 38
- **Class**: D11ADA
- **Branch**: B.E. Artificial Intelligence & Data Science
- **Semester**: V
- **Subject**: Full Stack Development &mdash; Web Development

---

## 📑 Index

| Program No. | Program Title / Task | CO Mapping |
|:---:|:---|:---:|
| **1** | Browser-based student attendance management interface (HTML, CSS, JS) | CO1, CO2 |
| **2** | React application for student attendance management (JSX, state, routing) | CO3 |
| **3** | Node.js server-side utility for student attendance management (FS, HTTP) | CO4 |
| **4** | Express.js REST API for student attendance management (CRUD, JWT, Bcrypt) | CO5 |
| **5** | Integrate React frontend with Express backend & Database (Full Stack / MERN) | CO6 |

---

# Program 1: Browser-Based Student Attendance Interface

### Aim
To build a browser-based student attendance interface using HTML, CSS, and JavaScript, demonstrating DOM manipulation, event handling, Fetch API, and input validation.

### Software and Hardware Requirements
- **Software**: Modern Web Browser (Google Chrome, Microsoft Edge, Mozilla Firefox), Text Editor / IDE (VS Code).
- **Hardware**: Standard PC / Laptop.

### Theory
The Document Object Model (DOM) is an application programming interface for HTML and XML documents. It defines the logical structure of documents and the way a document is accessed and manipulated. With DOM manipulation, JavaScript can dynamically generate table rows, modify styles, and listen to user interactions. The Fetch API provides a modern, promise-based interface for making asynchronous HTTP requests without page refreshes, enabling seamless client-side updates (Single Page Application paradigm).

### Technologies Used
HTML5, CSS3 (CSS Variables, Flexbox, Grid), Vanilla JavaScript (ES6+), Fetch API, JSON.

### Algorithm / Procedure
1. Create semantic HTML5 structure with form inputs for Roll Number, Student Name, Course, Date, and Status.
2. Apply responsive CSS styling with clean color-coded status badges (Present, Late, Absent).
3. Attach DOM event listeners for form submission, input validation, search filtering, and sorting.
4. Validate user inputs in real-time to prevent empty submissions and incorrect roll number formats.
5. Fetch initial attendance records asynchronously using `fetch('./data/students.json')` and `async/await`.
6. Dynamically construct and append table rows using `document.createElement()` and update KPI counters.

### Source Code (HTML & JavaScript Excerpt)
```html
<!-- index.html excerpt -->
<form id="attendanceForm">
  <input type="text" id="rollNo" placeholder="e.g. 38" required />
  <input type="text" id="studentName" placeholder="e.g. Ayush Sharma" required />
  <select id="course"><option value="B.E. AI & DS">B.E. AI & DS</option></select>
  <input type="date" id="attendanceDate" required />
  <button type="submit" id="submitBtn">Record Attendance</button>
</form>
<table id="attendanceTable">
  <thead><tr><th>Roll No</th><th>Name</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
  <tbody id="attendanceTableBody"></tbody>
</table>
```

```javascript
// app.js excerpt
async function fetchAttendanceData() {
  try {
    const res = await fetch('./data/students.json');
    const data = await res.json();
    state.records = data;
    renderTable(state.records);
  } catch (err) {
    state.records = [...FALLBACK_STUDENTS];
    renderTable(state.records);
  }
}

elements.form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateAllFields()) return;
  const newRecord = { 
    id: Date.now(), 
    rollNo: elements.rollNo.value.trim(), 
    name: elements.studentName.value.trim(), 
    status: 'Present' 
  };
  state.records.unshift(newRecord);
  renderTable(state.records);
});
```

### Explanation of Code
The HTML markup establishes a dual-column layout with a data entry form on the left and a KPI overview with a tabular records listing on the right. In `app.js`, `fetchAttendanceData()` uses modern `async/await` syntax to load records from `students.json`. The form submit listener intercepts submissions with `e.preventDefault()`, executes client-side validation on field lengths and regex patterns, dynamically generates table rows using DOM methods, recalculates attendance percentages, and simulates HTTP methods in the activity logger.

### Expected Output
- **Full Dashboard View**: Shows KPI metric counters, attendance form, and student records table.
- **Form Validation View**: Highlights invalid fields with red borders and descriptive error labels (`Student Name is required.`).

### Result
Successfully created a responsive, browser-based student attendance interface handling dynamic DOM manipulation, Fetch API data loading, real-time input validation, sorting, and status toggling.

### Learning Outcomes
Acquired thorough understanding of DOM node creation, event propagation, client-side input validation, and modern asynchronous Fetch API integration.

---

# Program 2: React Application for Student Attendance

### Aim
To develop a React application for student attendance using reusable functional components, JSX, props, state, conditional rendering, event handling, and React Router navigation.

### Software and Hardware Requirements
- **Software**: Node.js (v18+), NPM, Vite, React Developer Tools, VS Code, Web Browser.
- **Hardware**: Standard PC / Laptop.

### Theory
React is an open-source component-based JavaScript library for building responsive user interfaces. Functional components leverage React Hooks such as `useState` for managing dynamic component state, `useEffect` for synchronizing side-effects (e.g., localStorage caching and mounting initialization), and `useMemo` for computed filtering. React Router DOM manages client-side routing, enabling navigation across views (Dashboard, Mark Attendance, Records, Analytics) without triggering full page reloads.

### Technologies Used
React 18, React Router DOM v6, Vite, JSX, CSS3 Modules.

### Algorithm / Procedure
1. Initialize React project using Vite with modern React 18 template.
2. Install `react-router-dom` for declarative client-side routing.
3. Design reusable functional components: `Navbar`, `StatSummary`, `AttendanceForm`, `AttendanceList`, and `StatusBadge`.
4. Implement state management in parent `App.jsx` with `useState` and `useEffect`.
5. Configure multi-view routes: `/` (Dashboard), `/mark` (Form), `/records` (List), and `/analytics`.
6. Implement conditional rendering for empty states, status badges, and inline validation warnings.

### Source Code (React Excerpt)
```jsx
// App.jsx excerpt
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import MarkAttendancePage from './pages/MarkAttendancePage';
import RecordsPage from './pages/RecordsPage';

function App() {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('react_attendance');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  useEffect(() => {
    localStorage.setItem('react_attendance', JSON.stringify(records));
  }, [records]);

  const handleSaveRecord = (formData, editId) => {
    if (editId) {
      setRecords(prev => prev.map(r => r.id === editId ? { ...r, ...formData } : r));
    } else {
      setRecords(prev => [{ id: Date.now(), ...formData }, ...prev]);
    }
  };

  return (
    <div className="app-layout">
      <Navbar recordCount={records.length} />
      <Routes>
        <Route path="/" element={<DashboardPage records={records} />} />
        <Route path="/mark" element={<MarkAttendancePage onSaveRecord={handleSaveRecord} />} />
        <Route path="/records" element={<RecordsPage records={records} />} />
      </Routes>
    </div>
  );
}
```

### Explanation of Code
The React application employs a modular architecture where `App.jsx` maintains the centralized attendance state. The `useState` hook initializes records from `localStorage`, while `useEffect` automatically synchronizes modifications. Components communicate via props and callback handlers. `AttendanceForm` implements controlled inputs with validation, and `AttendanceList` uses `useMemo` for instant search filtering and multi-field sorting.

### Expected Output
- **Dashboard View**: Displays attendance KPI cards (Total, Present, Late, Absent, Effective Rate %), university compliance progress bar (75% threshold), and quick action buttons.

### Result
Successfully developed a Single Page Application using React functional components, hooks, props, state, and React Router navigation with local persistence.

### Learning Outcomes
Mastered state management, component lifecycles using hooks, prop drilling, conditional UI rendering, and declarative client-side routing.

---

# Program 3: Node.js Server-Side Utility

### Aim
To create a Node.js server-side utility for student attendance using File System, Path, and EventEmitter modules to store and retrieve records via a basic HTTP server without Express.

### Software and Hardware Requirements
- **Software**: Node.js runtime environment (v18+), VS Code, PowerShell / cURL.
- **Hardware**: Standard PC / Laptop.

### Theory
Node.js runs JavaScript on the server utilizing the V8 engine and libuv for non-blocking asynchronous event-driven I/O. The core `http` module creates raw web servers without framework wrappers. The `fs/promises` and `path` modules handle safe, platform-independent disk operations. `EventEmitter` enables decoupled event-driven architectures by emitting notifications when attendance events occur. Node.js `Streams` process data chunk-by-chunk, enabling high-performance memory-efficient CSV export and real-time log streaming.

### Technologies Used
Node.js Core Modules (`http`, `fs`, `path`, `events`, `stream`), JSON, JavaScript ES6+.

### Algorithm / Procedure
1. Import native Node.js core modules: `http`, `fs`, `path`, `events`, and `stream`.
2. Create an `AttendanceEventEmitter` class to dispatch and listen for audit logging events.
3. Instantiate native HTTP server via `http.createServer()` and implement URL-based routing manually.
4. Handle incoming chunked request body streams via `req.on('data')` and `req.on('end')`.
5. Read and write records to `attendance_records.json` using asynchronous promise-based file I/O.
6. Stream CSV exports using `stream.Readable.pipe(res)` and log files using `fs.createReadStream()`.

### Source Code (server.js Excerpt)
```javascript
// server.js excerpt (without Express)
const http = require('http');
const fsPromises = require('fs').promises;
const path = require('path');
const { Readable } = require('stream');
const attendanceEmitter = require('./attendanceEmitter');

const DATA_FILE = path.join(__dirname, 'data', 'attendance_records.json');

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const { pathname, searchParams } = parsedUrl;

  if (pathname === '/api/attendance' && req.method === 'GET') {
    const data = JSON.parse(await fsPromises.readFile(DATA_FILE, 'utf8'));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, count: data.length, data }));
  }

  if (pathname === '/api/attendance/export' && req.method === 'GET') {
    const records = JSON.parse(await fsPromises.readFile(DATA_FILE, 'utf8'));
    res.writeHead(200, { 'Content-Type': 'text/csv' });
    const csvStream = new Readable({
      read() {
        this.push('ID,Roll No,Name,Status\n');
        records.forEach(r => this.push(`${r.id},"${r.rollNo}","${r.name}",${r.status}\n`));
        this.push(null);
      }
    });
    return csvStream.pipe(res);
  }
});
```

### Explanation of Code
The core server avoids third-party abstractions like Express, parsing incoming HTTP requests directly. File paths are resolved safely using `path.join()`. The custom `AttendanceEventEmitter` intercepts attendance operations and appends timestamped audit logs asynchronously via an append-only writable stream. Endpoint `/api/attendance/export` demonstrates dynamic streaming of CSV files by piping a Readable stream into the HTTP response.

### Expected Output
- **Server Startup Console**: Server starts on port 4000, confirming storage path and event stream log path.
- **Automated Test Client**: `node test-client.js` executes 7 test cases covering `GET`, `POST`, `PUT`, `DELETE`, logs stream, and CSV export.

### Result
Successfully implemented a pure Node.js server-side utility validating core module architecture, file persistence, event dispatching, and stream-based data piping.

### Learning Outcomes
Learned low-level HTTP request lifecycle handling, stream-based data piping, asynchronous file I/O operations, and event-driven programming without third-party frameworks.

---

# Program 4: Express.js REST API with Authentication

### Aim
To develop an Express.js REST API for student attendance implementing CRUD operations, request logging middleware, input validation, centralized error handling, and a protected route using JWT and bcrypt.

### Software and Hardware Requirements
- **Software**: Node.js, Express.js, bcryptjs, jsonwebtoken, VS Code, Postman / cURL.
- **Hardware**: Standard PC / Laptop.

### Theory
Express.js is a minimal and flexible Node.js web application framework providing a robust suite of features for REST APIs. REST architectures rely on stateless HTTP verbs (GET, POST, PUT, DELETE). Middleware functions execute sequentially during request processing. Password security requires one-way cryptographic hashing using bcrypt with salt rounds. JSON Web Tokens (JWT) enable stateless authorization by issuing cryptographically signed tokens transmitted in the `Authorization: Bearer <token>` header.

### API Route Specification
| Method | Endpoint | Access | Description |
|:---:|---|:---:|---|
| **POST** | `/api/auth/register` | Public | Hash password with bcrypt & register user |
| **POST** | `/api/auth/login` | Public | Authenticate user & issue signed JWT |
| **GET** | `/api/auth/profile` | Protected | Verify token & return user profile |
| **GET** | `/api/attendance` | Public | Retrieve attendance records with filters |
| **POST** | `/api/attendance` | Protected | Validate inputs & record attendance |
| **PUT** | `/api/attendance/:id` | Protected | Validate & update record by ID |
| **DELETE** | `/api/attendance/:id` | Protected | Delete attendance record by ID |

### Source Code Excerpt
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing Bearer Token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Forbidden: Invalid Token' });
  }
}

// controllers/authController.js
async function register(req, res) {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = { id: Date.now(), email: req.body.email, password: hashedPassword };
  db.users.push(user);
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
  res.status(201).json({ success: true, token, user: { email: user.email } });
}
```

### Explanation of Code
The Express.js application establishes a pipeline where every request flows through request logging middleware measuring execution time in milliseconds. User passwords are encrypted with `bcrypt.hash()` using 10 salt rounds. Upon successful credential verification, `jwt.sign()` issues a signed bearer token. The `authenticateJWT` middleware guards CRUD modifications by validating the header token before invoking controller actions. Centralized error handling catches unhandled exceptions and outputs uniform JSON payloads.

### Expected Output
- **Test Runner Output (Part 1 & 2)**: All 10 verification scenarios executed against ephemeral test server with 100% pass rate.

### Result
Successfully developed and verified an Express.js REST API with full CRUD endpoints, custom logger, input validation middleware, centralized error handling, and JWT authentication with bcrypt-hashed passwords.

### Learning Outcomes
Understood middleware pipelines, secure password hashing, stateless token authentication, and standardized REST API modeling.

---

# Program 5: Full Stack Integration & Cloud Deployment

### Aim
To integrate the student attendance React frontend with an Express.js backend and database persistence using PostgreSQL with Sequelize or MongoDB with Mongoose, configure CORS, handle environment variables, connect frontend to API, and prepare cloud deployment on Vercel and Render.

### Software and Hardware Requirements
- **Software**: Node.js, Express, React, Sequelize ORM (PostgreSQL & SQLite), cors, dotenv, Vite, VS Code, Git.
- **Hardware**: Standard PC / Laptop.

### Theory
Full-stack integration connects a client-side user interface (React SPA) to a server-side REST API (Express) backed by a persistent database layer. Because frontend and backend operate on separate origins during development and production, Cross-Origin Resource Sharing (CORS) headers must be configured securely. Object-Relational Mapping (ORM) through Sequelize abstracts database operations into JavaScript classes, supporting PostgreSQL in production and zero-setup SQLite locally. Deployment configurations (`vercel.json` for client rewrites and `render.yaml` for web services) ensure seamless cloud deployment.

### Database Schema (Sequelize Model)
- **Model**: `Attendance` | **Table**: `student_attendance`
  - `id`: Integer (Auto-Increment, Primary Key)
  - `rollNo`: String (Not Null)
  - `name`: String (Not Null, Length 3-100)
  - `course`: String (Default: 'B.E. AI & DS')
  - `semester`: String (Default: 'Semester V')
  - `date`: DateOnly (Not Null)
  - `status`: Enum ('Present', 'Late', 'Absent')
  - `remarks`: Text

### Source Code Excerpt
```javascript
// backend/models/Attendance.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Attendance = sequelize.define('Attendance', {
  rollNo: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  course: { type: DataTypes.STRING, defaultValue: 'B.E. AI & DS' },
  date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.ENUM('Present', 'Late', 'Absent'), defaultValue: 'Present' },
  remarks: { type: DataTypes.TEXT }
});

// frontend/src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  async getAllAttendance() {
    const res = await fetch(`${BASE_URL}/attendance`);
    return res.json();
  },
  async createAttendance(data) {
    const res = await fetch(`${BASE_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
```

### Expected Output
- **Backend Startup**: Shows database synchronization and allowed CORS origins.
- **Connected Portal**: React SPA displays `● API Online` with real-time database record counter.
- **Database Records Table**: Displays records retrieved from the database with action buttons.
- **Analytics View**: Displays departmental compliance rates and absentee alerts.

### Deployment Prep
- **Backend on Render**: Render Blueprint `render.yaml` defines a Node web service and a managed PostgreSQL instance. Environment variables (`DATABASE_URL`, `FRONTEND_URL`) are securely bound with start command `node src/server.js`.
- **Frontend on Vercel**: `vercel.json` configures Vite build output and SPA routing rewrites (`/(.*) -> /index.html`). Environment variable `VITE_API_URL` connects the frontend to the Render backend service.

### Result
Successfully integrated the React frontend with an Express backend and database persistence via Sequelize ORM, configured dynamic CORS, environment variables, and established deployment configurations for Vercel and Render.

### Learning Outcomes
Gained comprehensive experience in connecting frontend and backend systems, implementing persistent database ORM modeling, securing cross-origin communication, and configuring modern cloud deployment platforms.

---

# Overall Conclusion

Throughout this Continuous Assessment (CAI) practical assignment, the fundamental concepts of Full Stack Web Development were comprehensively explored and implemented across five individual programs, satisfying all six Course Outcomes (CO1 to CO6).

Starting with vanilla HTML5, responsive CSS3, and JavaScript in Program 1 (CO1, CO2), the principles of DOM manipulation, event handling, and asynchronous Fetch API data loading were established. Program 2 (CO3) elevated client-side development by creating a Single Page Application using React functional components, hooks (`useState`, `useEffect`), conditional rendering, and declarative React Router navigation.

On the backend, Program 3 (CO4) demystified server-side architecture by building a pure Node.js core utility without external frameworks, implementing native HTTP routing, File System persistence, `EventEmitter` pub/sub messaging, and memory-efficient Streams. Program 4 (CO5) scaled the server into a robust Express.js REST API equipped with request duration logging, schema input validation, centralized error handling, and secure JWT authentication with bcrypt-hashed passwords.

Finally, Program 5 (CO6) unified the full-stack architecture by connecting the React frontend to the Express REST API backed by persistent relational database storage via Sequelize ORM (supporting PostgreSQL on Render and SQLite for local development). Configuring Cross-Origin Resource Sharing (CORS), environment variables, and cloud deployment blueprints for Vercel and Render provided practical, industry-standard experience in architecting, securing, and deploying modern web applications.
