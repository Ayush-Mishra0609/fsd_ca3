"""
Build Practical Journal PDF for Ayush Kumar Mishra (Roll No: 38, Class: D11ADA)
FSD / Web Development CAI Practical Journal covering Programs 1 to 5 (CO1 - CO6).
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    Image, KeepTogether, PageBreak, HRFlowable, Preformatted
)
from reportlab.pdfgen import canvas

PDF_FILENAME = "FSD_CA3_Practical_Journal_Ayush_Mishra_Roll38.pdf"
ASSETS_DIR = r"c:\Users\ayush\OneDrive\Desktop\fsd ca3\report_assets"

# Numbered Canvas for Two-Pass Page Numbering (e.g. Page X of Y)
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            # Suppress headers/footers on cover page
            return

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))

        # Running Header
        self.drawString(54, 750, "Full Stack Development & Web Dev — CAI Practical Journal")
        self.drawRightString(558, 750, "B.E. (AI & DS) | Sem V | Class: D11ADA")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 744, 558, 744)

        # Running Footer
        self.line(54, 45, 558, 45)
        self.drawString(54, 32, "Ayush Kumar Mishra | Roll No: 38")
        self.drawRightString(558, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def create_journal_pdf():
    doc = SimpleDocTemplate(
        PDF_FILENAME,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    navy = colors.HexColor("#000080")
    primary_blue = colors.HexColor("#1e3a8a")
    header_blue = colors.HexColor("#2563eb")
    dark_gray = colors.HexColor("#1f2937")
    light_bg = colors.HexColor("#f8fafc")
    border_color = colors.HexColor("#e2e8f0")

    # Typography Styles
    title_cover_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=30,
        alignment=1, # Center
        textColor=navy
    )

    subtitle_cover_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=24,
        alignment=1,
        textColor=primary_blue
    )

    meta_cover_style = ParagraphStyle(
        'CoverMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=18,
        alignment=1,
        textColor=dark_gray
    )

    meta_cover_bold = ParagraphStyle(
        'CoverMetaBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=18,
        alignment=1,
        textColor=navy
    )

    h1_style = ParagraphStyle(
        'ProgramHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=navy,
        spaceAfter=10,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=header_blue,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=dark_gray,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=dark_gray,
        leftIndent=14,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.2,
        leading=9.5,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=0
    )

    story = []

    # =========================================================================
    # PAGE 1: COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 100))
    story.append(Paragraph("FULL STACK DEVELOPMENT &mdash; WEB DEVELOPMENT", title_cover_style))
    story.append(Spacer(1, 14))
    story.append(Paragraph("CAI PRACTICAL JOURNAL", subtitle_cover_style))
    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="60%", thickness=2, color=navy, spaceBefore=10, spaceAfter=80))

    story.append(Paragraph("Student Name: <strong>Ayush Kumar Mishra</strong>", meta_cover_style))
    story.append(Spacer(1, 8))
    story.append(Paragraph("Roll No.: <strong>38</strong>", meta_cover_style))
    story.append(Spacer(1, 8))
    story.append(Paragraph("Class: <strong>D11ADA</strong>", meta_cover_style))
    story.append(Spacer(1, 8))
    story.append(Paragraph("Branch: <strong>B.E. Artificial Intelligence & Data Science</strong>", meta_cover_style))
    story.append(Spacer(1, 8))
    story.append(Paragraph("Semester: <strong>V</strong>", meta_cover_style))
    story.append(Spacer(1, 8))
    story.append(Paragraph("Subject: <strong>Full Stack Development &mdash; Web Development</strong>", meta_cover_style))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: INDEX TABLE
    # =========================================================================
    story.append(Paragraph("Index", h1_style))
    story.append(Spacer(1, 8))

    index_data = [
        [
            Paragraph("<b>Program No.</b>", body_style),
            Paragraph("<b>Program Title / Task</b>", body_style),
            Paragraph("<b>CO Mapping</b>", body_style)
        ],
        [
            Paragraph("<b>1</b>", body_style),
            Paragraph("Browser-based student attendance management interface (HTML, CSS, JS)", body_style),
            Paragraph("CO1, CO2", body_style)
        ],
        [
            Paragraph("<b>2</b>", body_style),
            Paragraph("React application for student attendance management (JSX, state, routing)", body_style),
            Paragraph("CO3", body_style)
        ],
        [
            Paragraph("<b>3</b>", body_style),
            Paragraph("Node.js server-side utility for student attendance management (FS, HTTP)", body_style),
            Paragraph("CO4", body_style)
        ],
        [
            Paragraph("<b>4</b>", body_style),
            Paragraph("Express.js REST API for student attendance management (CRUD, JWT, Bcrypt)", body_style),
            Paragraph("CO5", body_style)
        ],
        [
            Paragraph("<b>5</b>", body_style),
            Paragraph("Integrate React frontend with Express backend & Database (Full Stack / MERN)", body_style),
            Paragraph("CO6", body_style)
        ]
    ]

    index_table = Table(index_data, colWidths=[80, 320, 104])
    index_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
        ('TEXTCOLOR', (0, 0), (-1, 0), navy),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.75, colors.HexColor("#94a3b8")),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(index_table)
    story.append(PageBreak())

    # =========================================================================
    # PROGRAM 1
    # =========================================================================
    story.append(Paragraph("Program 1: Browser-Based Student Attendance Interface", h1_style))

    story.append(Paragraph("Aim", h2_style))
    story.append(Paragraph(
        "To build a browser-based student attendance interface using HTML, CSS, and JavaScript, "
        "demonstrating DOM manipulation, event handling, Fetch API, and input validation.",
        body_style
    ))

    story.append(Paragraph("Software and Hardware Requirements", h2_style))
    story.append(Paragraph("<b>Software:</b> Web Browser (Chrome / Edge / Firefox), Text Editor / IDE (VS Code).", bullet_style))
    story.append(Paragraph("<b>Hardware:</b> Standard PC / Laptop.", bullet_style))

    story.append(Paragraph("Theory", h2_style))
    story.append(Paragraph(
        "The Document Object Model (DOM) is an application programming interface for HTML and XML documents. "
        "It defines the logical structure of documents and the way a document is accessed and manipulated. "
        "With DOM manipulation, JavaScript can dynamically generate table rows, modify styles, and listen to user interactions. "
        "The Fetch API provides a modern, promise-based interface for making asynchronous HTTP requests without page refreshes, "
        "enabling seamless client-side updates (Single Page Application paradigm).",
        body_style
    ))

    story.append(Paragraph("Technologies Used", h2_style))
    story.append(Paragraph("HTML5, CSS3 (CSS Variables, Flexbox, Grid), Vanilla JavaScript (ES6+), Fetch API, JSON.", body_style))

    story.append(Paragraph("Algorithm / Procedure", h2_style))
    story.append(Paragraph("1. Create semantic HTML5 structure with form inputs for Roll Number, Student Name, Course, Date, and Status.", bullet_style))
    story.append(Paragraph("2. Apply responsive CSS styling with clean color-coded status badges (Present, Late, Absent).", bullet_style))
    story.append(Paragraph("3. Attach DOM event listeners for form submission, input validation, search filtering, and sorting.", bullet_style))
    story.append(Paragraph("4. Validate user inputs in real-time to prevent empty submissions and incorrect roll number formats.", bullet_style))
    story.append(Paragraph("5. Fetch initial attendance records asynchronously using <code>fetch('./data/students.json')</code> and <code>async/await</code>.", bullet_style))
    story.append(Paragraph("6. Dynamically construct and append table rows using <code>document.createElement()</code> and update KPI counters.", bullet_style))

    story.append(Paragraph("Source Code (HTML & JavaScript Excerpt)", h2_style))
    code_p1 = """<!-- index.html excerpt -->
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
  const newRecord = { id: Date.now(), rollNo: elements.rollNo.value.trim(), name: elements.studentName.value.trim(), status: 'Present' };
  state.records.unshift(newRecord);
  renderTable(state.records);
});"""

    p1_code_table = Table([[Preformatted(code_p1, code_style)]], colWidths=[504])
    p1_code_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), light_bg),
        ('BOX', (0, 0), (-1, -1), 0.5, border_color),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(p1_code_table)

    story.append(Paragraph("Explanation of Code", h2_style))
    story.append(Paragraph(
        "The HTML markup establishes a dual-column layout with a data entry form on the left and a KPI overview with a tabular records listing on the right. "
        "In <code>app.js</code>, <code>fetchAttendanceData()</code> uses modern <code>async/await</code> syntax to load records from <code>students.json</code>. "
        "The form submit listener intercepts submissions with <code>e.preventDefault()</code>, executes client-side validation on field lengths and regex patterns, "
        "dynamically generates table rows using DOM methods, recalculates attendance percentages, and simulates HTTP methods in the activity logger.",
        body_style
    ))

    story.append(Paragraph("Expected Output", h2_style))
    img1_path = os.path.join(ASSETS_DIR, "screenshot_1.png")
    img2_path = os.path.join(ASSETS_DIR, "screenshot_2.png")
    if os.path.exists(img1_path):
        story.append(Image(img1_path, width=500, height=265))
        story.append(Spacer(1, 4))
    if os.path.exists(img2_path):
        story.append(Image(img2_path, width=200, height=330))
        story.append(Spacer(1, 4))

    story.append(Paragraph("Result", h2_style))
    story.append(Paragraph(
        "Successfully created a responsive, browser-based student attendance interface handling dynamic DOM manipulation, "
        "Fetch API data loading, real-time input validation, sorting, and status toggling.",
        body_style
    ))

    story.append(Paragraph("Learning Outcomes", h2_style))
    story.append(Paragraph(
        "Acquired thorough understanding of DOM node creation, event propagation, client-side input validation, "
        "and modern asynchronous Fetch API integration.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # PROGRAM 2
    # =========================================================================
    story.append(Paragraph("Program 2: React Application for Student Attendance", h1_style))

    story.append(Paragraph("Aim", h2_style))
    story.append(Paragraph(
        "To develop a React application for student attendance using reusable functional components, JSX, props, state, "
        "conditional rendering, event handling, and React Router navigation.",
        body_style
    ))

    story.append(Paragraph("Software and Hardware Requirements", h2_style))
    story.append(Paragraph("<b>Software:</b> Node.js (v18+), NPM, Vite, React Developer Tools, VS Code, Web Browser.", bullet_style))
    story.append(Paragraph("<b>Hardware:</b> Standard PC / Laptop.", bullet_style))

    story.append(Paragraph("Theory", h2_style))
    story.append(Paragraph(
        "React is an open-source component-based JavaScript library for building responsive user interfaces. "
        "Functional components leverage React Hooks such as <code>useState</code> for managing dynamic component state, "
        "<code>useEffect</code> for synchronizing side-effects (e.g., localStorage caching and mounting initialization), "
        "and <code>useMemo</code> for computed filtering. React Router DOM manages client-side routing, enabling navigation "
        "across views (Dashboard, Mark Attendance, Records, Analytics) without triggering full page reloads.",
        body_style
    ))

    story.append(Paragraph("Technologies Used", h2_style))
    story.append(Paragraph("React 18, React Router DOM v6, Vite, JSX, CSS3 Modules.", body_style))

    story.append(Paragraph("Algorithm / Procedure", h2_style))
    story.append(Paragraph("1. Initialize React project using Vite with modern React 18 template.", bullet_style))
    story.append(Paragraph("2. Install <code>react-router-dom</code> for declarative client-side routing.", bullet_style))
    story.append(Paragraph("3. Design reusable functional components: <code>Navbar</code>, <code>StatSummary</code>, <code>AttendanceForm</code>, <code>AttendanceList</code>, and <code>StatusBadge</code>.", bullet_style))
    story.append(Paragraph("4. Implement state management in parent <code>App.jsx</code> with <code>useState</code> and <code>useEffect</code>.", bullet_style))
    story.append(Paragraph("5. Configure multi-view routes: <code>/</code> (Dashboard), <code>/mark</code> (Form), <code>/records</code> (List), and <code>/analytics</code>.", bullet_style))
    story.append(Paragraph("6. Implement conditional rendering for empty states, status badges, and inline validation warnings.", bullet_style))

    story.append(Paragraph("Source Code (React Components Excerpt)", h2_style))
    code_p2 = """// App.jsx excerpt
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
}"""

    p2_code_table = Table([[Preformatted(code_p2, code_style)]], colWidths=[504])
    p2_code_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), light_bg),
        ('BOX', (0, 0), (-1, -1), 0.5, border_color),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(p2_code_table)

    story.append(Paragraph("Explanation of Code", h2_style))
    story.append(Paragraph(
        "The React application employs a modular architecture where <code>App.jsx</code> maintains the centralized attendance state. "
        "The <code>useState</code> hook initializes records from <code>localStorage</code>, while <code>useEffect</code> automatically synchronizes modifications. "
        "Components communicate via props and callback handlers. <code>AttendanceForm</code> implements controlled inputs with validation, "
        "and <code>AttendanceList</code> uses <code>useMemo</code> for instant search filtering and multi-field sorting.",
        body_style
    ))

    story.append(Paragraph("Expected Output", h2_style))
    img3_path = os.path.join(ASSETS_DIR, "screenshot_3.png")
    if os.path.exists(img3_path):
        story.append(Image(img3_path, width=500, height=265))
        story.append(Spacer(1, 4))

    story.append(Paragraph("Result", h2_style))
    story.append(Paragraph(
        "Successfully developed a Single Page Application using React functional components, hooks, props, state, "
        "and React Router navigation with local persistence.",
        body_style
    ))

    story.append(Paragraph("Learning Outcomes", h2_style))
    story.append(Paragraph(
        "Mastered state management, component lifecycles using hooks, prop drilling, conditional UI rendering, "
        "and declarative client-side routing.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # PROGRAM 3
    # =========================================================================
    story.append(Paragraph("Program 3: Node.js Server-Side Utility", h1_style))

    story.append(Paragraph("Aim", h2_style))
    story.append(Paragraph(
        "To create a Node.js server-side utility for student attendance using File System, Path, and EventEmitter modules "
        "to store and retrieve records via a basic HTTP server without Express.",
        body_style
    ))

    story.append(Paragraph("Software and Hardware Requirements", h2_style))
    story.append(Paragraph("<b>Software:</b> Node.js runtime environment (v18+), VS Code, PowerShell / cURL.", bullet_style))
    story.append(Paragraph("<b>Hardware:</b> Standard PC / Laptop.", bullet_style))

    story.append(Paragraph("Theory", h2_style))
    story.append(Paragraph(
        "Node.js runs JavaScript on the server utilizing the V8 engine and libuv for non-blocking asynchronous event-driven I/O. "
        "The core <code>http</code> module creates raw web servers without framework wrappers. "
        "The <code>fs/promises</code> and <code>path</code> modules handle safe, platform-independent disk operations. "
        "<code>EventEmitter</code> enables decoupled event-driven architectures by emitting notifications when attendance events occur. "
        "Node.js <code>Streams</code> process data chunk-by-chunk, enabling high-performance memory-efficient CSV export and real-time log streaming.",
        body_style
    ))

    story.append(Paragraph("Algorithm / Procedure", h2_style))
    story.append(Paragraph("1. Import native Node.js core modules: <code>http</code>, <code>fs</code>, <code>path</code>, <code>events</code>, and <code>stream</code>.", bullet_style))
    story.append(Paragraph("2. Create an <code>AttendanceEventEmitter</code> class to dispatch and listen for audit logging events.", bullet_style))
    story.append(Paragraph("3. Instantiate native HTTP server via <code>http.createServer()</code> and implement URL-based routing manually.", bullet_style))
    story.append(Paragraph("4. Handle incoming chunked request body streams via <code>req.on('data')</code> and <code>req.on('end')</code>.", bullet_style))
    story.append(Paragraph("5. Read and write records to <code>attendance_records.json</code> using asynchronous promise-based file I/O.", bullet_style))
    story.append(Paragraph("6. Stream CSV exports using <code>stream.Readable.pipe(res)</code> and log files using <code>fs.createReadStream()</code>.", bullet_style))

    story.append(Paragraph("Source Code (server.js Excerpt)", h2_style))
    code_p3 = """// server.js excerpt (without Express)
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
        this.push('ID,Roll No,Name,Status\\n');
        records.forEach(r => this.push(`${r.id},"${r.rollNo}","${r.name}",${r.status}\\n`));
        this.push(null);
      }
    });
    return csvStream.pipe(res);
  }
});"""

    p3_code_table = Table([[Preformatted(code_p3, code_style)]], colWidths=[504])
    p3_code_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), light_bg),
        ('BOX', (0, 0), (-1, -1), 0.5, border_color),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(p3_code_table)

    story.append(Paragraph("Explanation of Code", h2_style))
    story.append(Paragraph(
        "The core server avoids third-party abstractions like Express, parsing incoming HTTP requests directly. "
        "File paths are resolved safely using <code>path.join()</code>. The custom <code>AttendanceEventEmitter</code> intercepts attendance operations "
        "and appends timestamped audit logs asynchronously via an append-only writable stream. "
        "Endpoint <code>/api/attendance/export</code> demonstrates dynamic streaming of CSV files by piping a Readable stream into the HTTP response.",
        body_style
    ))

    story.append(Paragraph("Expected Output", h2_style))
    img4_path = os.path.join(ASSETS_DIR, "screenshot_4.png")
    img5_path = os.path.join(ASSETS_DIR, "screenshot_5.png")
    if os.path.exists(img4_path):
        story.append(Image(img4_path, width=480, height=145))
        story.append(Spacer(1, 4))
    if os.path.exists(img5_path):
        story.append(Image(img5_path, width=480, height=410))
        story.append(Spacer(1, 4))

    story.append(Paragraph("Result", h2_style))
    story.append(Paragraph(
        "Successfully implemented a pure Node.js server-side utility validating core module architecture, "
        "file persistence, event dispatching, and stream-based data piping.",
        body_style
    ))

    story.append(Paragraph("Learning Outcomes", h2_style))
    story.append(Paragraph(
        "Learned low-level HTTP request lifecycle handling, stream-based data piping, asynchronous file I/O operations, "
        "and event-driven programming without third-party frameworks.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # PROGRAM 4
    # =========================================================================
    story.append(Paragraph("Program 4: Express.js REST API with Authentication", h1_style))

    story.append(Paragraph("Aim", h2_style))
    story.append(Paragraph(
        "To develop an Express.js REST API for student attendance implementing CRUD operations, request logging middleware, "
        "input validation, centralized error handling, and a protected route using JWT and bcrypt.",
        body_style
    ))

    story.append(Paragraph("Software and Hardware Requirements", h2_style))
    story.append(Paragraph("<b>Software:</b> Node.js, Express.js, bcryptjs, jsonwebtoken, VS Code, Postman / cURL.", bullet_style))
    story.append(Paragraph("<b>Hardware:</b> Standard PC / Laptop.", bullet_style))

    story.append(Paragraph("Theory", h2_style))
    story.append(Paragraph(
        "Express.js is a minimal and flexible Node.js web application framework providing a robust suite of features for REST APIs. "
        "REST architectures rely on stateless HTTP verbs (GET, POST, PUT, DELETE). "
        "Middleware functions execute sequentially during request processing. Password security requires one-way cryptographic hashing "
        "using bcrypt with salt rounds. JSON Web Tokens (JWT) enable stateless authorization by issuing cryptographically signed tokens "
        "transmitted in the <code>Authorization: Bearer &lt;token&gt;</code> header.",
        body_style
    ))

    story.append(Paragraph("API Route Specification", h2_style))
    api_spec = [
        [Paragraph("<b>Method</b>", body_style), Paragraph("<b>Endpoint</b>", body_style), Paragraph("<b>Access</b>", body_style), Paragraph("<b>Description</b>", body_style)],
        [Paragraph("POST", body_style), Paragraph("<code>/api/auth/register</code>", body_style), Paragraph("Public", body_style), Paragraph("Hash password with bcrypt & register user", body_style)],
        [Paragraph("POST", body_style), Paragraph("<code>/api/auth/login</code>", body_style), Paragraph("Public", body_style), Paragraph("Authenticate user & issue signed JWT", body_style)],
        [Paragraph("GET", body_style), Paragraph("<code>/api/auth/profile</code>", body_style), Paragraph("Protected", body_style), Paragraph("Verify token & return user profile", body_style)],
        [Paragraph("GET", body_style), Paragraph("<code>/api/attendance</code>", body_style), Paragraph("Public", body_style), Paragraph("Retrieve attendance records with filters", body_style)],
        [Paragraph("POST", body_style), Paragraph("<code>/api/attendance</code>", body_style), Paragraph("Protected", body_style), Paragraph("Validate inputs & record attendance", body_style)],
        [Paragraph("PUT", body_style), Paragraph("<code>/api/attendance/:id</code>", body_style), Paragraph("Protected", body_style), Paragraph("Validate & update record by ID", body_style)],
        [Paragraph("DELETE", body_style), Paragraph("<code>/api/attendance/:id</code>", body_style), Paragraph("Protected", body_style), Paragraph("Delete attendance record by ID", body_style)]
    ]
    api_table = Table(api_spec, colWidths=[55, 125, 65, 259])
    api_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), light_bg),
        ('GRID', (0, 0), (-1, -1), 0.5, border_color),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(api_table)

    story.append(Paragraph("Source Code (Express & Middlewares Excerpt)", h2_style))
    code_p4 = """// middleware/auth.js
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
}"""

    p4_code_table = Table([[Preformatted(code_p4, code_style)]], colWidths=[504])
    p4_code_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), light_bg),
        ('BOX', (0, 0), (-1, -1), 0.5, border_color),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(p4_code_table)

    story.append(Paragraph("Explanation of Code", h2_style))
    story.append(Paragraph(
        "The Express.js application establishes a pipeline where every request flows through request logging middleware "
        "measuring execution time in milliseconds. User passwords are encrypted with <code>bcrypt.hash()</code> using 10 salt rounds. "
        "Upon successful credential verification, <code>jwt.sign()</code> issues a signed bearer token. "
        "The <code>authenticateJWT</code> middleware guards CRUD modifications by validating the header token before invoking controller actions. "
        "Centralized error handling catches unhandled exceptions and outputs uniform JSON payloads.",
        body_style
    ))

    story.append(Paragraph("Expected Output", h2_style))
    img6_path = os.path.join(ASSETS_DIR, "screenshot_6.png")
    img7_path = os.path.join(ASSETS_DIR, "screenshot_7.png")
    if os.path.exists(img6_path):
        story.append(Image(img6_path, width=480, height=355))
        story.append(Spacer(1, 4))
    if os.path.exists(img7_path):
        story.append(Image(img7_path, width=480, height=285))
        story.append(Spacer(1, 4))

    story.append(Paragraph("Result", h2_style))
    story.append(Paragraph(
        "Successfully developed and verified an Express.js REST API with full CRUD endpoints, custom logger, "
        "input validation middleware, centralized error handling, and JWT authentication with bcrypt-hashed passwords.",
        body_style
    ))

    story.append(Paragraph("Learning Outcomes", h2_style))
    story.append(Paragraph(
        "Understood middleware pipelines, secure password hashing, stateless token authentication, and standardized REST API modeling.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # PROGRAM 5
    # =========================================================================
    story.append(Paragraph("Program 5: Full Stack Integration & Cloud Deployment", h1_style))

    story.append(Paragraph("Aim", h2_style))
    story.append(Paragraph(
        "To integrate the student attendance React frontend with an Express.js backend and database persistence using PostgreSQL with Sequelize "
        "or MongoDB with Mongoose, configure CORS, handle environment variables, connect frontend to API, and prepare cloud deployment on Vercel and Render.",
        body_style
    ))

    story.append(Paragraph("Software and Hardware Requirements", h2_style))
    story.append(Paragraph("<b>Software:</b> Node.js, Express, React, Sequelize ORM (PostgreSQL & SQLite), cors, dotenv, Vite, VS Code, Git.", bullet_style))
    story.append(Paragraph("<b>Hardware:</b> Standard PC / Laptop.", bullet_style))

    story.append(Paragraph("Theory", h2_style))
    story.append(Paragraph(
        "Full-stack integration connects a client-side user interface (React SPA) to a server-side REST API (Express) "
        "backed by a persistent database layer. Because frontend and backend operate on separate origins during development and production, "
        "Cross-Origin Resource Sharing (CORS) headers must be configured securely. "
        "Object-Relational Mapping (ORM) through Sequelize abstracts database operations into JavaScript classes, supporting PostgreSQL in production "
        "and zero-setup SQLite locally. Deployment configurations (<code>vercel.json</code> for client rewrites and <code>render.yaml</code> for web services) "
        "ensure seamless cloud deployment.",
        body_style
    ))

    story.append(Paragraph("Database Schema (Sequelize Model)", h2_style))
    story.append(Paragraph(
        "<b>Model:</b> <code>Attendance</code> | <b>Table:</b> <code>student_attendance</code><br/>"
        "&bull; <code>id</code>: Integer (Auto-Increment, Primary Key)<br/>"
        "&bull; <code>rollNo</code>: String (Not Null)<br/>"
        "&bull; <code>name</code>: String (Not Null, Length 3-100)<br/>"
        "&bull; <code>course</code>: String (Default: 'B.E. AI & DS')<br/>"
        "&bull; <code>semester</code>: String (Default: 'Semester V')<br/>"
        "&bull; <code>date</code>: DateOnly (Not Null)<br/>"
        "&bull; <code>status</code>: Enum ('Present', 'Late', 'Absent')<br/>"
        "&bull; <code>remarks</code>: Text",
        body_style
    ))

    story.append(Paragraph("Source Code (Sequelize & React Integration Excerpt)", h2_style))
    code_p5 = """// backend/models/Attendance.js
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
};"""

    p5_code_table = Table([[Preformatted(code_p5, code_style)]], colWidths=[504])
    p5_code_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), light_bg),
        ('BOX', (0, 0), (-1, -1), 0.5, border_color),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(p5_code_table)

    story.append(Paragraph("Expected Output", h2_style))
    img8_path = os.path.join(ASSETS_DIR, "screenshot_8.png")
    img9_path = os.path.join(ASSETS_DIR, "screenshot_9.png")
    img10_path = os.path.join(ASSETS_DIR, "screenshot_10.png")
    img11_path = os.path.join(ASSETS_DIR, "screenshot_11.png")
    img12_path = os.path.join(ASSETS_DIR, "screenshot_12.png")

    if os.path.exists(img8_path):
        story.append(Image(img8_path, width=480, height=145))
        story.append(Spacer(1, 4))
    if os.path.exists(img9_path):
        story.append(Image(img9_path, width=480, height=270))
        story.append(Spacer(1, 4))
    if os.path.exists(img10_path):
        story.append(Image(img10_path, width=400, height=220))
        story.append(Spacer(1, 4))
    if os.path.exists(img11_path):
        story.append(Image(img11_path, width=480, height=215))
        story.append(Spacer(1, 4))
    if os.path.exists(img12_path):
        story.append(Image(img12_path, width=480, height=200))
        story.append(Spacer(1, 4))

    story.append(Paragraph("Deployment Prep", h2_style))
    story.append(Paragraph(
        "<b>Backend on Render:</b> Render Blueprint <code>render.yaml</code> defines a Node web service and a managed PostgreSQL instance. "
        "Environment variables (<code>DATABASE_URL</code>, <code>FRONTEND_URL</code>) are securely bound with start command <code>node src/server.js</code>.<br/>"
        "<b>Frontend on Vercel:</b> <code>vercel.json</code> configures Vite build output and SPA routing rewrites (<code>/(.*) &rarr; /index.html</code>). "
        "Environment variable <code>VITE_API_URL</code> connects the frontend to the Render backend service.",
        body_style
    ))

    story.append(Paragraph("Result", h2_style))
    story.append(Paragraph(
        "Successfully integrated the React frontend with an Express backend and database persistence via Sequelize ORM, "
        "configured dynamic CORS, environment variables, and established deployment configurations for Vercel and Render.",
        body_style
    ))

    story.append(Paragraph("Learning Outcomes", h2_style))
    story.append(Paragraph(
        "Gained comprehensive experience in connecting frontend and backend systems, implementing persistent database ORM modeling, "
        "securing cross-origin communication, and configuring modern cloud deployment platforms.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # OVERALL CONCLUSION
    # =========================================================================
    story.append(Paragraph("Overall Conclusion", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "Throughout this Continuous Assessment (CAI) practical assignment, the fundamental concepts of Full Stack Web Development "
        "were comprehensively explored and implemented across five individual programs, satisfying all six Course Outcomes (CO1 to CO6).",
        body_style
    ))
    story.append(Paragraph(
        "Starting with vanilla HTML5, responsive CSS3, and JavaScript in Program 1 (CO1, CO2), the principles of DOM manipulation, "
        "event handling, and asynchronous Fetch API data loading were established. Program 2 (CO3) elevated client-side development "
        "by creating a Single Page Application using React functional components, hooks (<code>useState</code>, <code>useEffect</code>), "
        "conditional rendering, and declarative React Router navigation.",
        body_style
    ))
    story.append(Paragraph(
        "On the backend, Program 3 (CO4) demystified server-side architecture by building a pure Node.js core utility without external frameworks, "
        "implementing native HTTP routing, File System persistence, <code>EventEmitter</code> pub/sub messaging, and memory-efficient Streams. "
        "Program 4 (CO5) scaled the server into a robust Express.js REST API equipped with request duration logging, schema input validation, "
        "centralized error handling, and secure JWT authentication with bcrypt-hashed passwords.",
        body_style
    ))
    story.append(Paragraph(
        "Finally, Program 5 (CO6) unified the full-stack architecture by connecting the React frontend to the Express REST API backed by persistent "
        "relational database storage via Sequelize ORM (supporting PostgreSQL on Render and SQLite for local development). "
        "Configuring Cross-Origin Resource Sharing (CORS), environment variables, and cloud deployment blueprints for Vercel and Render "
        "provided practical, industry-standard experience in architecting, securing, and deploying modern web applications.",
        body_style
    ))

    # Build PDF with two-pass canvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF journal: {PDF_FILENAME}")


if __name__ == "__main__":
    create_journal_pdf()
