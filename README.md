# FULL STACK DEVELOPMENT &mdash; PROGRAMMING EXERCISE
## Individual Practical Assignment | B.E. (AI & DS) | Semester V

- **Student Roll No**: 38
- **Department**: Artificial Intelligence & Data Science
- **Semester**: V
- **Subject**: Full Stack Development / Web Development
- **Total Assigned Programs**: 5 (Covering all six Course Outcomes: CO1 &ndash; CO6)
- **📸 Execution Screenshots & Output Document**: [FSD_Practical_Assignment_Outputs_Roll38.pdf](FSD_Practical_Assignment_Outputs_Roll38.pdf)

---

## 📑 Course Outcomes (CO) Mapping Matrix

| Program No. | Program Title / Focus | Course Outcomes | Key Technologies Used |
|---|---|---|---|
| **Program 1** | Browser-Based Student Attendance Interface | **CO1, CO2** | Semantic HTML5, CSS3 Variables & Flex/Grid, Vanilla JavaScript, DOM Manipulation, Fetch API, async/await |
| **Program 2** | React Application for Student Attendance | **CO3** | React 18, JSX, Functional Components, Props, State, `useState`, `useEffect`, `useMemo`, React Router DOM v6 |
| **Program 3** | Node.js Server-Side Utility (without Express) | **CO4** | Node.js Core (`http`, `fs/promises`, `path`), `EventEmitter`, Readable & Writable `Streams` |
| **Program 4** | Express.js REST API with JWT & Bcrypt | **CO5** | Express.js, Custom Logger Middleware, Input Validation Middleware, Centralized Error Handling, JWT, Bcrypt |
| **Program 5** | Integrated Full-Stack React + Express + Database | **CO6** | React Frontend, Express Backend, Sequelize ORM (PostgreSQL / SQLite), CORS, `.env`, Vercel & Render configs |

---

## 📁 Repository & Directory Layout

```
fsd-ca3/
├── Program-1-HTML-CSS-JS/              # Program 1 (CO1, CO2)
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── data/students.json
│   └── README.md
├── Program-2-React-Attendance/         # Program 2 (CO3)
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── components/ (Navbar, AttendanceForm, AttendanceList, StatSummary, StatusBadge)
│   │   ├── pages/ (DashboardPage, MarkAttendancePage, RecordsPage, AnalyticsPage)
│   │   ├── data/initialData.js
│   │   ├── App.jsx & App.css
│   │   └── main.jsx & index.css
│   └── README.md
├── Program-3-Nodejs-Core-Server/       # Program 3 (CO4)
│   ├── package.json
│   ├── server.js (Core HTTP server without Express)
│   ├── attendanceEmitter.js (EventEmitter & Stream logger)
│   ├── test-client.js (Automated test runner)
│   ├── data/attendance_records.json
│   ├── logs/attendance_events.log
│   └── README.md
├── Program-4-Express-REST-API/         # Program 4 (CO5)
│   ├── package.json
│   ├── .env & .env.example
│   ├── test-api.js (Automated test suite)
│   ├── src/
│   │   ├── server.js
│   │   ├── middleware/ (logger, validate, auth, errorHandler)
│   │   ├── routes/ (authRoutes, attendanceRoutes)
│   │   ├── controllers/ (authController, attendanceController)
│   │   └── data/db.js
│   └── README.md
├── Program-5-FullStack-Integration/    # Program 5 (CO6)
│   ├── backend/
│   │   ├── package.json
│   │   ├── render.yaml (Render cloud deployment blueprint)
│   │   ├── .env & .env.example
│   │   └── src/
│   │       ├── server.js (Express server with dynamic CORS)
│   │       ├── config/db.js (Sequelize for PostgreSQL / SQLite)
│   │       ├── models/Attendance.js (Sequelize Model)
│   │       ├── models/mongooseModelSample.js (Mongoose Schema reference)
│   │       ├── routes/attendanceRoutes.js
│   │       └── seed.js
│   ├── frontend/
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   ├── vercel.json (Vercel deployment rewrites)
│   │   ├── .env & .env.example
│   │   ├── index.html
│   │   └── src/ (React 18 SPA connected to API)
│   └── README.md
└── README.md                           # Master Lab Portfolio (This Document)
```

---

## 🔍 Detailed Program Summaries & Execution Instructions

### 1️⃣ Program 1: Browser-Based Student Attendance Interface (CO1, CO2)
- **Task**: Build an attendance web interface using HTML, CSS, and JS with DOM manipulation, Fetch API, and simulated HTTP methods.
- **Key Features**:
  - Semantic HTML5 and responsive CSS3 Grid/Flexbox design.
  - Real-time client-side input validation on `input` and `blur` events.
  - Asynchronous data retrieval using `fetch()` and `async/await`.
  - HTTP activity monitor logger simulating `GET`, `POST`, `PUT`, `DELETE`.
  - Multi-field sorting, search filtering, and one-click CSV export.
- **Execution**:
  ```bash
  cd Program-1-HTML-CSS-JS
  # Double-click index.html OR serve locally:
  npx serve .
  ```

---

### 2️⃣ Program 2: React Application for Student Attendance (CO3)
- **Task**: Develop a React app using functional components, JSX, props, state, hooks, and React Router navigation.
- **Key Features**:
  - Reusable functional components (`Navbar`, `StatSummary`, `AttendanceForm`, `AttendanceList`, `StatusBadge`).
  - Hooks: `useState` for dynamic state and `useEffect` for data synchronization.
  - Conditional rendering for status badges and validation errors.
  - React Router navigation (`/`, `/mark`, `/records`, `/analytics`).
- **Execution**:
  ```bash
  cd Program-2-React-Attendance
  npm install
  npm run dev
  ```

---

### 3️⃣ Program 3: Node.js Core Server-Side Utility (CO4)
- **Task**: Create a server-side attendance utility using `fs`, `path`, `Streams`, and `EventEmitter` **without Express**.
- **Key Features**:
  - Native `http.createServer()` with handcrafted router.
  - File System module (`fs/promises`) and `path.join()` for data persistence in `data/attendance_records.json`.
  - `EventEmitter` (`attendanceEmitter.js`) emitting `attendance:marked`, `attendance:updated`, `attendance:deleted`, `attendance:warning`.
  - `Streams`: Append-only audit logger using `fs.createWriteStream`, log streaming via `fs.createReadStream`, and CSV streaming export via `stream.Readable.pipe(res)`.
- **Execution**:
  ```bash
  cd Program-3-Nodejs-Core-Server
  node server.js
  # In another terminal, run automated test suite:
  node test-client.js
  ```

---

### 4️⃣ Program 4: Express.js REST API with JWT & Bcrypt (CO5)
- **Task**: Implement CRUD routes using GET, POST, PUT, DELETE with logging, validation, centralized error handling, and JWT authentication with bcrypt.
- **Key Features**:
  - Full CRUD routes on `/api/attendance`.
  - Request logging middleware recording method, path, status, and duration in ms.
  - Input validation middleware checking roll number format, names, and status enum.
  - Centralized error handling middleware.
  - Security: User registration with `bcrypt.hash(password, 10)` and login issuing signed JSON Web Tokens (`jwt.sign`).
  - Route guard `authenticateJWT` protecting write operations.
- **Execution**:
  ```bash
  cd Program-4-Express-REST-API
  npm install
  npm start
  # Run automated test suite:
  node test-api.js
  ```

---

### 5️⃣ Program 5: Full-Stack React + Express + Database Integration (CO6)
- **Task**: Integrate React frontend with Express backend and database persistence (PostgreSQL with Sequelize or MongoDB with Mongoose), configure CORS & `.env`, and prepare deployment on Vercel and Render.
- **Key Features**:
  - Full-stack client-server communication using Fetch API with dynamic `VITE_API_URL`.
  - Database persistence using Sequelize ORM configured for PostgreSQL on Render, with zero-setup local SQLite fallback.
  - Dynamic CORS middleware handling origins (`FRONTEND_URL` and `localhost`).
  - Cloud deployment configurations: `frontend/vercel.json` and `backend/render.yaml`.
- **Execution**:
  ```bash
  # Step 1: Start Backend Server
  cd Program-5-FullStack-Integration/backend
  npm install
  npm run seed     # Seeds sample data
  npm start        # Runs on port 5000

  # Step 2: Start Frontend Application
  cd Program-5-FullStack-Integration/frontend
  npm install
  npm run dev      # Runs on port 3000
  ```

---

## 📋 Evaluation & Submission Checklist
- [x] All 5 programs individually implemented in dedicated subdirectories.
- [x] Meaningful variable names, robust input validation, and centralized error handling across all programs.
- [x] Course outcome mapping (CO1 through CO6) explicitly annotated in code and documentation.
- [x] Database schemas, models, and endpoints comprehensively documented without hardcoded passwords or secret keys.
- [x] Zero-configuration test runners included for instant verification.
- [x] Deployment configurations for Vercel (`vercel.json`) and Render (`render.yaml`) created and documented.
