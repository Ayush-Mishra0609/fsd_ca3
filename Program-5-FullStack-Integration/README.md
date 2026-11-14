# Program 5: Full-Stack React + Express + Database Integration & Deployment

- **Course**: Full Stack Development / Web Development
- **Degree / Branch**: B.E. (Artificial Intelligence & Data Science) | Semester V
- **Student Roll No**: 38
- **Course Outcome Covered**: **CO6** (Full-Stack Integration, Database Persistence with Sequelize/PostgreSQL or MongoDB/Mongoose, CORS, Environment Variables, and Cloud Deployment on Vercel & Render)

---

## 📋 Task Description
> Integrate the student attendance React frontend with an Express.js backend and database. Persist application records using PostgreSQL with Sequelize or MongoDB with Mongoose; configure CORS and environment variables, connect the frontend to the API, and prepare deployment on Vercel (frontend) and Render (backend).

---

## 🏗️ System Architecture

```
┌─────────────────────────────────┐                 ┌─────────────────────────────────┐
│     Frontend (Vercel Host)      │                 │      Backend (Render Host)      │
│  React 18 SPA + Vite Router     │  HTTP / JSON    │  Express.js RESTful API Server  │
│  Base URL: VITE_API_URL         │ ──────────────> │  CORS Configured with Origin    │
│  Vercel Config: vercel.json     │ <────────────── │  Render Config: render.yaml     │
└─────────────────────────────────┘                 └───────────────┬─────────────────┘
                                                                    │
                                                            Sequelize ORM
                                                            DATABASE_URL
                                                                    │
                                                                    ▼
                                                    ┌─────────────────────────────────┐
                                                    │       Database Persistence      │
                                                    │  PostgreSQL (Render Cloud DB)   │
                                                    │  / SQLite (Zero-Setup Local)    │
                                                    └─────────────────────────────────┘
```

---

## 🗄️ Database Schemas & Models

### 1. PostgreSQL Schema with Sequelize (`backend/src/models/Attendance.js`)
```javascript
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
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
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
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Present', 'Late', 'Absent'),
    allowNull: false,
    defaultValue: 'Present'
  },
  remarks: {
    type: DataTypes.TEXT,
    defaultValue: 'General Attendance'
  }
}, {
  tableName: 'student_attendance',
  timestamps: true
});
```

### 2. Alternative MongoDB Mongoose Schema (`backend/src/models/mongooseModelSample.js`)
```javascript
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  course: { type: String, default: 'B.E. AI & DS' },
  semester: { type: String, default: 'Semester V' },
  date: { type: String, required: true },
  status: { type: String, enum: ['Present', 'Late', 'Absent'], default: 'Present' },
  remarks: { type: String, default: 'General Attendance' }
}, {
  timestamps: true
});
```

---

## 🔐 Environment Variables & CORS Configuration

### Backend `.env` (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
# DATABASE_URL=postgres://user:password@render-postgres-host:5432/attendance_db
```

### Frontend `.env` (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### CORS Security Setup (`backend/src/server.js`)
```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS blocked by server security policy.'));
  },
  credentials: true
}));
```

---

## 🚀 How to Run Locally

### Step 1: Start the Backend Server
```bash
cd Program-5-FullStack-Integration/backend
npm install
npm run seed     # (Optional) Seed sample student records into database
npm start
```
The API server starts on `http://localhost:5000`.

### Step 2: Start the React Frontend
In a second terminal:
```bash
cd Program-5-FullStack-Integration/frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser. The frontend will automatically detect the backend and display `● API Online`.

---

## ☁️ Cloud Deployment Configuration

### 1. Backend Deployment on Render (`backend/render.yaml`)
- A ready-to-use Render Blueprint file `backend/render.yaml` is included:
```yaml
services:
  - type: web
    name: student-attendance-api
    runtime: node
    plan: free
    buildCommand: npm install
    startCommand: node src/server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: FRONTEND_URL
        value: https://your-frontend-app.vercel.app
      - key: DATABASE_URL
        fromDatabase:
          name: attendance-postgres-db
          property: connectionString

databases:
  - name: attendance-postgres-db
    plan: free
    databaseName: attendance_db
    user: attendance_admin
```

### 2. Frontend Deployment on Vercel (`frontend/vercel.json`)
- To ensure client-side React Router navigation works seamlessly without 404 errors on browser refresh, `frontend/vercel.json` provides:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
- In the Vercel Dashboard, set the environment variable:
  `VITE_API_URL=https://student-attendance-api.onrender.com/api`
