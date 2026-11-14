# Program 2: React Application for Student Attendance

- **Course**: Full Stack Development / Web Development
- **Degree / Branch**: B.E. (Artificial Intelligence & Data Science) | Semester V
- **Student Roll No**: 38
- **Course Outcome Covered**: **CO3** (React Components, JSX, Props, State, Hooks, Event Handling, and React Router Navigation)

---

## 📋 Task Description
> Develop a React application for student attendance using reusable functional components, JSX, props and state. Implement a data-entry form and listing view; use useState and useEffect, conditional rendering, event handling and React Router navigation.

---

## 🌟 Key Features & Technical Highlights

1. **Reusable Functional Components & JSX**:
   - `Navbar`: Sticky header navigation with active route highlights and student roll badge.
   - `StatSummary`: Calculates and renders attendance metric cards (Total, Present, Late, Absent, Effective Rate %).
   - `StatusBadge`: Clean color-coded indicator pill with dynamic icons (`● Present`, `▲ Late`, `■ Absent`).
   - `AttendanceForm`: Controlled inputs, client-side validation, error messages, and dual-mode (Create / Edit).
   - `AttendanceList`: Interactive records table with multi-field search, status filtering, and sorting.

2. **React Hooks (`useState` & `useEffect`)**:
   - `useState`: Manages attendance records collection, form data fields, validation errors, active filter pill, search queries, sort orders, and toast notifications.
   - `useEffect`: Synchronizes state with browser `localStorage` for data persistence across page reloads, and binds form fields during edit mode.

3. **Conditional Rendering**:
   - Dynamic error labels beneath invalid input fields.
   - Status badge styling (`Present`, `Late`, `Absent`).
   - Empty listing placeholders (`No attendance records found`) with reset filter triggers.
   - Toggle between **Record Attendance** and **Update Record** modes.

4. **Event Handling**:
   - Controlled input `onChange` handlers with automatic inline error clearing.
   - Form submission `onSubmit` with client-side validation guard.
   - Real-time search query filtering and status toggling (`Present` &rarr; `Late` &rarr; `Absent`).

5. **React Router Navigation (`react-router-dom`)**:
   - `/`: Dashboard overview with KPI cards, compliance progress bar, and recent logs.
   - `/mark`: Data-entry form for recording or updating student attendance.
   - `/records`: Listing view with comprehensive search, filters, sorting, and action buttons.
   - `/analytics`: Departmental attendance breakdowns and absenteeism insights.

---

## 📂 Project Directory Structure

```
Program-2-React-Attendance/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx                 # Entry point with BrowserRouter
│   ├── App.jsx                  # Main component with state, routes, and notifications
│   ├── index.css                # Base stylesheet and CSS variables
│   ├── App.css                  # Component styling, layouts, and responsive cards
│   ├── components/
│   │   ├── Navbar.jsx           # Top navigation bar with NavLinks
│   │   ├── StatSummary.jsx      # KPI cards calculation and rendering
│   │   ├── AttendanceForm.jsx   # Data-entry form with validation & controlled state
│   │   ├── AttendanceList.jsx   # Listing view with search, filter, and sorting
│   │   └── StatusBadge.jsx      # Reusable status indicator
│   ├── pages/
│   │   ├── DashboardPage.jsx    # Dashboard route component
│   │   ├── MarkAttendancePage.jsx # Entry form route component
│   │   ├── RecordsPage.jsx      # Listing view route component
│   │   └── AnalyticsPage.jsx    # Analytics route component
│   └── data/
│       └── initialData.js       # Seed dataset
└── README.md
```

---

## 🚀 How to Run

1. Navigate to the project directory:
   ```bash
   cd Program-2-React-Attendance
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open the displayed local URL in your browser (typically `http://localhost:3000` or `http://localhost:5173`).

5. To build for production:
   ```bash
   npm run build
   ```

---

## 🧪 Verification & Expected Outputs

1. **Dashboard (`/`)**: Displays KPI stats for Total, Present, Late, Absent, and Attendance Rate with a visual compliance bar.
2. **Form Entry (`/mark`)**:
   - Enter student details (Roll No `38`, Name `Ayush Sharma`, Date, Status `Present`).
   - Click **Save Attendance Record**: A green toast notification appears, and you are automatically redirected to the records list view.
3. **Records View (`/records`)**:
   - Test instant search by typing a name or roll number.
   - Click filter pills (**All**, **Present**, **Late**, **Absent**).
   - Click **🔄 Toggle** to change status in-place.
   - Click **✏️ Edit** to return to the form with fields pre-filled.
4. **Analytics (`/analytics`)**: View departmental attendance rates and the list of students marked absent.
