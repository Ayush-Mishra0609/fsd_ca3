# Program 1: Browser-Based Student Attendance Interface

- **Course**: Full Stack Development / Web Development
- **Degree / Branch**: B.E. (Artificial Intelligence & Data Science) | Semester V
- **Student Roll No**: 38
- **Course Outcomes Covered**: **CO1** (HTML/CSS layout, DOM manipulation, form validation) & **CO2** (Asynchronous operations, Fetch API, Event Handling)

---

## 📋 Task Description
> Build a browser-based student attendance interface using HTML, CSS and JavaScript. Use DOM manipulation and event handling to capture and validate user input; retrieve sample data with Fetch API and async/await, and display it dynamically. Demonstrate suitable HTTP methods and JSON request/response data, with sorting, status updates and meaningful error messages.

---

## 🌟 Key Features Implemented

1. **Semantic HTML5 & Responsive CSS3 UI**:
   - Modern dashboard layout using CSS Grid and Flexbox.
   - Dynamic KPI statistic cards (Total Records, Present, Late, Absent, Attendance Rate %).
   - Professional status indicator pills and accessible form inputs.

2. **DOM Manipulation & Event Handling (CO1)**:
   - Dynamic table rows generated via `DocumentFragment` without reloading.
   - Form submission handling with `preventDefault()`.
   - Real-time inline input validation on `input` and `blur` events (Roll Number format check, Student Name character validation, required date).
   - Clear and meaningful error messages beneath offending fields.

3. **Asynchronous Fetch API & JSON Requests (CO2)**:
   - `fetch('./data/students.json')` with `async/await` and error handling.
   - Simulation of HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) with live JSON request/response activity log.
   - Graceful fallback for local `file://` execution to guarantee out-of-the-box working experience.

4. **Interactive Controls & Data Operations**:
   - **Search Filter**: Instant real-time filtering across Student Name, Roll Number, and Remarks.
   - **Status Filter**: View All, Present Only, Late Only, or Absent Only.
   - **Multi-Field Sorting**: Sort by Roll No (ascending/descending), Name (A-Z/Z-A), Date, or Status.
   - **Inline Quick Status Toggle**: Cycle between Present &rarr; Late &rarr; Absent with a single click.
   - **CSV Export**: One-click download of attendance data formatted as `.csv`.
   - **Toast Notifications**: Feedback messages for user actions.

---

## 📂 Project Directory Structure

```
Program-1-HTML-CSS-JS/
├── index.html           # Main semantic HTML5 interface
├── style.css            # Responsive styles and color-coded themes
├── app.js               # Core DOM manipulation, Fetch API, and validation logic
├── data/
│   └── students.json    # Initial sample JSON dataset
└── README.md            # Program documentation and explanation
```

---

## 🚀 How to Run

### Method 1: Direct Browser Launch
Simply double click `index.html` or right-click and select **Open with Google Chrome / Microsoft Edge / Firefox**.

### Method 2: Local HTTP Server (Recommended)
Using Python or Node.js to serve files over HTTP:
```bash
# Using Node.js (npx)
cd Program-1-HTML-CSS-JS
npx serve .

# Or using Python 3
python -m http.server 3000
```
Open `http://localhost:3000` in your web browser.

---

## 🧪 Verification & Expected Outputs

1. **Initial Load**: The app fetches records from `data/students.json` asynchronously and updates KPI counters.
2. **Form Validation**:
   - Submitting an empty form highlights fields with red borders and displays descriptive error messages.
   - Entering numbers in name or invalid characters in roll number triggers validation errors.
3. **Adding a Record**:
   - Fill out Roll No `38`, Name `Ayush Sharma`, select Date and Status `Present`.
   - Click **Record Attendance**: Toast notification appears, the record is appended dynamically, stats recalculate, and the HTTP logger records `POST /api/v1/students/attendance 201 CREATED`.
4. **Status Toggle & Edit**:
   - Click **Toggle** on any row to cycle status.
   - Click **Edit** to populate the form and perform an update.
