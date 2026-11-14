# Program 4: Express.js REST API for Student Attendance

- **Course**: Full Stack Development / Web Development
- **Degree / Branch**: B.E. (Artificial Intelligence & Data Science) | Semester V
- **Student Roll No**: 38
- **Course Outcome Covered**: **CO5** (Express.js REST Architecture, Middleware Pipeline, JWT Authentication, and Bcrypt Password Hashing)

---

## 📋 Task Description
> Develop an Express.js REST API for student attendance. Implement CRUD routes using GET, POST, PUT and DELETE; add middleware for request logging and input validation, centralized error handling, and a protected route using JWT authentication with bcrypt-hashed passwords.

---

## 🌟 Architecture & Features Implemented

1. **RESTful CRUD Operations**:
   - `GET /api/attendance`: Retrieves all attendance records with optional filtering (`status`, `search`) and sorting (`sortBy=name|rollNo|date`).
   - `GET /api/attendance/:id`: Fetches a specific attendance record by its ID.
   - `GET /api/attendance/stats`: Computes live attendance metrics and compliance rate.
   - `POST /api/attendance`: Adds a new student record (Protected & Validated).
   - `PUT /api/attendance/:id`: Updates an existing student record (Protected & Validated).
   - `DELETE /api/attendance/:id`: Removes a record (Protected).

2. **Custom Middleware Architecture**:
   - **Request Logging (`src/middleware/logger.js`)**: Intercepts requests, logs method, original URL, response status code, and execution time in milliseconds (`ms`).
   - **Input Validation (`src/middleware/validate.js`)**: Validates required fields, name minimum length, valid status enumerations (`Present`, `Late`, `Absent`), and date formats. Returns descriptive 400 Bad Request error arrays on failure.
   - **Centralized Error Handling (`src/middleware/errorHandler.js`)**: Intercepts all runtime exceptions and returns a consistent JSON payload with timestamp and path.

3. **Security: Bcrypt Hashing & JWT Authentication**:
   - `POST /api/auth/register`: Salts and hashes user passwords using `bcrypt.hash(password, 10)` before storing in the database.
   - `POST /api/auth/login`: Verifies plaintext password against the stored bcrypt hash using `bcrypt.compare()`. On success, issues a signed JSON Web Token (JWT) with a 24-hour expiration.
   - **Authentication Middleware (`src/middleware/auth.js`)**: Verifies the `Authorization: Bearer <token>` header, decodes the user payload, and attaches `req.user`.

---

## 📂 Project Directory Structure

```
Program-4-Express-REST-API/
├── package.json
├── .env.example
├── .env
├── test-api.js              # Automated test runner testing all 10 scenarios
├── src/
│   ├── server.js            # Express application bootstrap & route mounting
│   ├── middleware/
│   │   ├── auth.js          # JWT verification & protected route guard
│   │   ├── logger.js        # Custom HTTP request logger
│   │   ├── validate.js      # Input validation middleware
│   │   └── errorHandler.js  # Centralized error handler
│   ├── routes/
│   │   ├── authRoutes.js    # Auth routes (/register, /login, /profile)
│   │   └── attendanceRoutes.js # Attendance CRUD routes
│   ├── controllers/
│   │   ├── authController.js       # Auth business logic
│   │   └── attendanceController.js # Attendance CRUD business logic
│   └── data/
│       ├── db.js            # Persistent data store repository
│       └── records.json     # Backing JSON store
└── README.md
```

---

## 📡 API Endpoints Reference

### 1. Authentication Endpoints
| Method | Route | Access | Description | Request Body |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user with bcrypt password hash | `{ "name", "email", "password", "role" }` |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue signed JWT | `{ "email", "password" }` |
| `GET` | `/api/auth/profile` | **Protected (JWT)** | Get authenticated user info | Header: `Authorization: Bearer <token>` |

### 2. Attendance Endpoints
| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/attendance` | Public | Retrieve all records (supports `?status=...&search=...&sortBy=...`) |
| `GET` | `/api/attendance/stats` | Public | Real-time attendance rate and KPI statistics |
| `GET` | `/api/attendance/:id` | Public | Retrieve record by ID |
| `POST` | `/api/attendance` | **Protected (JWT)** | Create new record (requires validation & Bearer token) |
| `PUT` | `/api/attendance/:id` | **Protected (JWT)** | Update existing record (requires validation & Bearer token) |
| `DELETE` | `/api/attendance/:id` | **Protected (JWT)** | Delete record (requires Bearer token) |

---

## 🚀 How to Run

1. Navigate to the project directory:
   ```bash
   cd Program-4-Express-REST-API
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Express server:
   ```bash
   npm start
   ```
   The API will be live at `http://localhost:5000`.

4. Run the automated test suite:
   ```bash
   npm test
   ```
   Or:
   ```bash
   node test-api.js
   ```
