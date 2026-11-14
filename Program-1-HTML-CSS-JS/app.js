/**
 * Student Attendance Management System - Core Application Logic
 * Subject: Full Stack Development (B.E. AI & DS, Semester V)
 * Student Roll No: 38
 * Course Outcomes: CO1 (DOM Manipulation & Form Validation) & CO2 (Fetch API & Asynchronous Operations)
 */

// Application State
const state = {
  records: [],
  filteredRecords: [],
  searchTerm: '',
  filterStatus: 'ALL',
  sortBy: 'rollNo-asc',
  isEditing: false,
  editId: null
};

// Seed dataset fallback (used if fetch() is restricted in direct file:// mode)
const FALLBACK_STUDENTS = [
  { id: 1, rollNo: "38", name: "Ayush Sharma", course: "B.E. AI & DS", semester: "V", date: "2026-11-14", status: "Present", remarks: "On time, active participation" },
  { id: 2, rollNo: "01", name: "Aarav Patel", course: "B.E. AI & DS", semester: "V", date: "2026-11-14", status: "Present", remarks: "Lab session completed" },
  { id: 3, rollNo: "12", name: "Bhavya Rao", course: "B.E. AI & DS", semester: "V", date: "2026-11-14", status: "Absent", remarks: "Sick leave requested" },
  { id: 4, rollNo: "24", name: "Devansh Mehta", course: "B.E. AI & DS", semester: "V", date: "2026-11-14", status: "Late", remarks: "Arrived 15 mins late due to transit" },
  { id: 5, rollNo: "45", name: "Ishita Verma", course: "B.E. AI & DS", semester: "V", date: "2026-11-14", status: "Present", remarks: "Submitted assignment on time" },
  { id: 6, rollNo: "52", name: "Karan Nair", course: "B.E. AI & DS", semester: "V", date: "2026-11-14", status: "Absent", remarks: "Uninformed absence" }
];

// DOM Element References
const elements = {
  form: document.getElementById('attendanceForm'),
  formTitle: document.getElementById('formTitle'),
  submitBtnText: document.getElementById('submitBtnText'),
  resetFormBtn: document.getElementById('resetFormBtn'),
  cancelEditBtn: document.getElementById('cancelEditBtn'),
  
  // Inputs
  editRecordId: document.getElementById('editRecordId'),
  rollNo: document.getElementById('rollNo'),
  studentName: document.getElementById('studentName'),
  course: document.getElementById('course'),
  attendanceDate: document.getElementById('attendanceDate'),
  remarks: document.getElementById('remarks'),
  
  // Error Elements
  rollNoError: document.getElementById('rollNoError'),
  studentNameError: document.getElementById('studentNameError'),
  courseError: document.getElementById('courseError'),
  dateError: document.getElementById('dateError'),
  
  // Controls
  searchInput: document.getElementById('searchInput'),
  filterStatus: document.getElementById('filterStatus'),
  sortBy: document.getElementById('sortBy'),
  reloadSampleBtn: document.getElementById('reloadSampleBtn'),
  exportCsvBtn: document.getElementById('exportCsvBtn'),
  
  // Display Containers
  tableBody: document.getElementById('attendanceTableBody'),
  emptyState: document.getElementById('emptyState'),
  tableLoader: document.getElementById('tableLoader'),
  recordsCounter: document.getElementById('recordsCounter'),
  httpLogger: document.getElementById('httpLogger'),
  clearLogsBtn: document.getElementById('clearLogsBtn'),
  toastContainer: document.getElementById('toastContainer'),
  
  // KPI Stats
  statTotal: document.getElementById('statTotal'),
  statPresent: document.getElementById('statPresent'),
  statLate: document.getElementById('statLate'),
  statAbsent: document.getElementById('statAbsent'),
  statRate: document.getElementById('statRate')
};

// ==========================================================================
// Initialization & Lifecycle
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Set default date to today's date
  const today = new Date().toISOString().split('T')[0];
  elements.attendanceDate.value = today;

  // Setup Event Listeners
  setupEventListeners();

  // Load Initial Data using Fetch API and async/await
  fetchAttendanceData();
});

function setupEventListeners() {
  // Form submission & validation
  elements.form.addEventListener('submit', handleFormSubmit);
  elements.resetFormBtn.addEventListener('click', resetForm);
  elements.cancelEditBtn.addEventListener('click', cancelEdit);

  // Real-time input validation on blur / input
  elements.rollNo.addEventListener('input', () => validateField('rollNo'));
  elements.studentName.addEventListener('input', () => validateField('studentName'));
  elements.attendanceDate.addEventListener('change', () => validateField('attendanceDate'));

  // Filtering & Sorting
  elements.searchInput.addEventListener('input', handleSearch);
  elements.filterStatus.addEventListener('change', handleFilterChange);
  elements.sortBy.addEventListener('change', handleSortChange);
  elements.reloadSampleBtn.addEventListener('click', () => fetchAttendanceData(true));
  elements.exportCsvBtn.addEventListener('click', exportToCSV);
  elements.clearLogsBtn.addEventListener('click', () => {
    elements.httpLogger.innerHTML = '<div class="log-entry log-info">Logs cleared.</div>';
  });
}

// ==========================================================================
// Asynchronous Fetch API Implementation (CO2)
// ==========================================================================
async function fetchAttendanceData(forceReload = false) {
  showLoader(true);
  logHttpActivity('GET', '/api/v1/students/attendance', 'Requesting attendance data...');

  try {
    // Attempt to fetch from local json data directory
    const response = await fetch('./data/students.json', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: Failed to load data`);
    }

    const data = await response.json();
    
    // Simulate brief network latency for realistic feel
    await new Promise(resolve => setTimeout(resolve, 350));

    state.records = data;
    localStorage.setItem('fsd_attendance_records', JSON.stringify(data));
    
    logHttpActivity('200 OK', 'GET /api/v1/students/attendance', `Retrieved ${data.length} records successfully.`);
    showToast(`Loaded ${data.length} attendance records via Fetch API`, 'success');
  } catch (error) {
    console.warn('Fetch API encountered an error (likely local file:// protocol), using cached/fallback data.', error);
    
    // Fallback to localStorage or mock array for seamless browser experience
    const localSaved = localStorage.getItem('fsd_attendance_records');
    if (localSaved && !forceReload) {
      state.records = JSON.parse(localSaved);
    } else {
      state.records = [...FALLBACK_STUDENTS];
      localStorage.setItem('fsd_attendance_records', JSON.stringify(state.records));
    }

    logHttpActivity('200 (MOCK)', 'GET /api/v1/students/attendance', `Loaded ${state.records.length} records (Local Source).`);
    showToast('Fetched records from local student store', 'info');
  } finally {
    showLoader(false);
    applyFiltersAndRender();
  }
}

// ==========================================================================
// Form Validation & DOM Handling (CO1)
// ==========================================================================
function validateField(fieldName) {
  let isValid = true;

  if (fieldName === 'rollNo') {
    const val = elements.rollNo.value.trim();
    if (!val) {
      showError(elements.rollNo, elements.rollNoError, 'Roll Number is required.');
      isValid = false;
    } else if (!/^[A-Za-z0-9-]+$/.test(val)) {
      showError(elements.rollNo, elements.rollNoError, 'Roll No must be alphanumeric (e.g. 38 or AD-38).');
      isValid = false;
    } else {
      clearError(elements.rollNo, elements.rollNoError);
    }
  }

  if (fieldName === 'studentName') {
    const val = elements.studentName.value.trim();
    if (!val) {
      showError(elements.studentName, elements.studentNameError, 'Student Name is required.');
      isValid = false;
    } else if (val.length < 3) {
      showError(elements.studentName, elements.studentNameError, 'Name must be at least 3 characters.');
      isValid = false;
    } else if (!/^[a-zA-Z\s.]+$/.test(val)) {
      showError(elements.studentName, elements.studentNameError, 'Name should contain letters only.');
      isValid = false;
    } else {
      clearError(elements.studentName, elements.studentNameError);
    }
  }

  if (fieldName === 'attendanceDate') {
    const val = elements.attendanceDate.value;
    if (!val) {
      showError(elements.attendanceDate, elements.dateError, 'Attendance date is required.');
      isValid = false;
    } else {
      clearError(elements.attendanceDate, elements.dateError);
    }
  }

  return isValid;
}

function validateAllFields() {
  const isRollValid = validateField('rollNo');
  const isNameValid = validateField('studentName');
  const isDateValid = validateField('attendanceDate');
  return isRollValid && isNameValid && isDateValid;
}

function showError(inputElement, errorElement, message) {
  inputElement.classList.add('input-error');
  errorElement.textContent = message;
}

function clearError(inputElement, errorElement) {
  inputElement.classList.remove('input-error');
  errorElement.textContent = '';
}

// ==========================================================================
// CRUD Operations with Simulated HTTP Methods
// ==========================================================================
async function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateAllFields()) {
    showToast('Please correct form validation errors before submitting', 'error');
    return;
  }

  const selectedStatus = document.querySelector('input[name="status"]:checked')?.value || 'Present';
  const formData = {
    rollNo: elements.rollNo.value.trim(),
    name: elements.studentName.value.trim(),
    course: elements.course.value,
    date: elements.attendanceDate.value,
    status: selectedStatus,
    remarks: elements.remarks.value.trim() || 'General Attendance'
  };

  if (state.isEditing) {
    // Simulated HTTP PUT Request
    const recordId = parseInt(elements.editRecordId.value, 10);
    logHttpActivity('PUT', `/api/v1/students/attendance/${recordId}`, JSON.stringify(formData));

    const index = state.records.findIndex(r => r.id === recordId);
    if (index !== -1) {
      state.records[index] = { ...state.records[index], ...formData };
      saveToStorage();
      showToast(`Record updated for Roll No: ${formData.rollNo}`, 'success');
      logHttpActivity('200 OK', `PUT /api/v1/students/attendance/${recordId}`, 'Resource updated successfully');
    }
    cancelEdit();
  } else {
    // Check for duplicate attendance for same student on same date
    const isDuplicate = state.records.some(
      r => r.rollNo.toLowerCase() === formData.rollNo.toLowerCase() && r.date === formData.date
    );

    if (isDuplicate) {
      showToast(`Attendance already marked for Roll No ${formData.rollNo} on ${formData.date}`, 'warning');
      return;
    }

    // Simulated HTTP POST Request
    const newRecord = {
      id: Date.now(),
      ...formData,
      semester: 'V'
    };

    logHttpActivity('POST', '/api/v1/students/attendance', JSON.stringify(newRecord));

    // Append to state
    state.records.unshift(newRecord);
    saveToStorage();
    showToast(`Attendance recorded for ${newRecord.name} (${newRecord.status})`, 'success');
    logHttpActivity('201 CREATED', '/api/v1/students/attendance', `Record ID #${newRecord.id} generated.`);
    resetForm();
  }

  applyFiltersAndRender();
}

function startEdit(id) {
  const record = state.records.find(r => r.id === id);
  if (!record) return;

  state.isEditing = true;
  state.editId = id;

  elements.editRecordId.value = record.id;
  elements.rollNo.value = record.rollNo;
  elements.studentName.value = record.name;
  elements.course.value = record.course;
  elements.attendanceDate.value = record.date;
  elements.remarks.value = record.remarks || '';

  // Set status radio
  const radio = document.querySelector(`input[name="status"][value="${record.status}"]`);
  if (radio) radio.checked = true;

  // Update UI to editing state
  elements.formTitle.textContent = `Edit Attendance (Roll: ${record.rollNo})`;
  elements.submitBtnText.textContent = 'Update Record';
  elements.cancelEditBtn.classList.remove('hidden');

  // Scroll to form on small screens
  elements.form.scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
  state.isEditing = false;
  state.editId = null;
  resetForm();
  elements.formTitle.textContent = 'Mark Student Attendance';
  elements.submitBtnText.textContent = 'Record Attendance';
  elements.cancelEditBtn.classList.add('hidden');
}

function resetForm() {
  elements.form.reset();
  elements.editRecordId.value = '';
  const today = new Date().toISOString().split('T')[0];
  elements.attendanceDate.value = today;
  document.querySelector('input[name="status"][value="Present"]').checked = true;
  
  // Clear error styles
  clearError(elements.rollNo, elements.rollNoError);
  clearError(elements.studentName, elements.studentNameError);
  clearError(elements.attendanceDate, elements.dateError);
}

// Toggle attendance status (Present -> Absent -> Late -> Present)
function toggleStatus(id) {
  const record = state.records.find(r => r.id === id);
  if (!record) return;

  const statusCycle = { 'Present': 'Late', 'Late': 'Absent', 'Absent': 'Present' };
  const oldStatus = record.status;
  const newStatus = statusCycle[oldStatus] || 'Present';
  record.status = newStatus;

  // Log simulated PATCH/PUT request
  logHttpActivity('PATCH', `/api/v1/students/attendance/${id}/status`, JSON.stringify({ status: newStatus }));
  saveToStorage();
  applyFiltersAndRender();
  showToast(`Status toggled from ${oldStatus} to ${newStatus} for Roll No ${record.rollNo}`, 'info');
}

// Delete Record
function deleteRecord(id) {
  const record = state.records.find(r => r.id === id);
  if (!record) return;

  if (confirm(`Are you sure you want to delete attendance record for ${record.name} (Roll: ${record.rollNo})?`)) {
    logHttpActivity('DELETE', `/api/v1/students/attendance/${id}`, `Deleting record #${id}`);
    state.records = state.records.filter(r => r.id !== id);
    saveToStorage();
    applyFiltersAndRender();
    showToast(`Deleted attendance record for ${record.name}`, 'warning');
    logHttpActivity('204 NO CONTENT', `/api/v1/students/attendance/${id}`, 'Resource removed');
  }
}

// ==========================================================================
// Filtering, Sorting & Rendering (CO1 & CO2)
// ==========================================================================
function handleSearch(e) {
  state.searchTerm = e.target.value.toLowerCase().trim();
  applyFiltersAndRender();
}

function handleFilterChange(e) {
  state.filterStatus = e.target.value;
  applyFiltersAndRender();
}

function handleSortChange(e) {
  state.sortBy = e.target.value;
  applyFiltersAndRender();
}

function applyFiltersAndRender() {
  let result = [...state.records];

  // 1. Filter by Status
  if (state.filterStatus !== 'ALL') {
    result = result.filter(r => r.status.toLowerCase() === state.filterStatus.toLowerCase());
  }

  // 2. Search by student name, roll number, or remarks
  if (state.searchTerm) {
    result = result.filter(r =>
      r.name.toLowerCase().includes(state.searchTerm) ||
      r.rollNo.toLowerCase().includes(state.searchTerm) ||
      (r.remarks && r.remarks.toLowerCase().includes(state.searchTerm)) ||
      r.course.toLowerCase().includes(state.searchTerm)
    );
  }

  // 3. Sorting
  result.sort((a, b) => {
    switch (state.sortBy) {
      case 'rollNo-asc':
        return a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true });
      case 'rollNo-desc':
        return b.rollNo.localeCompare(a.rollNo, undefined, { numeric: true });
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  state.filteredRecords = result;
  renderTable(result);
  updateStats();
}

function renderTable(records) {
  elements.tableBody.innerHTML = '';

  if (records.length === 0) {
    elements.emptyState.classList.remove('hidden');
    elements.recordsCounter.textContent = 'Showing 0 records';
    return;
  }

  elements.emptyState.classList.add('hidden');
  elements.recordsCounter.textContent = `Showing ${records.length} of ${state.records.length} records`;

  const fragment = document.createDocumentFragment();

  records.forEach(record => {
    const tr = document.createElement('tr');
    tr.dataset.id = record.id;

    // Status Badge Class
    let badgeClass = 'badge-present';
    if (record.status === 'Late') badgeClass = 'badge-late';
    if (record.status === 'Absent') badgeClass = 'badge-absent';

    tr.innerHTML = `
      <td><span class="student-cell-roll">${escapeHtml(record.rollNo)}</span></td>
      <td><span class="student-cell-name">${escapeHtml(record.name)}</span></td>
      <td><small>${escapeHtml(record.course)}</small></td>
      <td>${escapeHtml(record.date)}</td>
      <td>
        <span class="badge ${badgeClass}">
          ${record.status === 'Present' ? '●' : record.status === 'Late' ? '▲' : '■'} ${escapeHtml(record.status)}
        </span>
      </td>
      <td><small style="color: var(--text-muted);">${escapeHtml(record.remarks || '-')}</small></td>
      <td>
        <div class="actions-cell">
          <button class="btn-action btn-action-toggle" title="Toggle Status (Present/Late/Absent)" onclick="toggleStatus(${record.id})">
            🔄 Toggle
          </button>
          <button class="btn-action btn-action-edit" title="Edit Record" onclick="startEdit(${record.id})">
            ✏️ Edit
          </button>
          <button class="btn-action btn-action-delete" title="Delete Record" onclick="deleteRecord(${record.id})">
            🗑️
          </button>
        </div>
      </td>
    `;

    fragment.appendChild(tr);
  });

  elements.tableBody.appendChild(fragment);
}

function updateStats() {
  const total = state.records.length;
  const present = state.records.filter(r => r.status === 'Present').length;
  const late = state.records.filter(r => r.status === 'Late').length;
  const absent = state.records.filter(r => r.status === 'Absent').length;

  // Effective Attendance Rate: (Present + 0.5 * Late) / Total * 100
  const rate = total > 0 ? Math.round(((present + (late * 0.5)) / total) * 100) : 0;

  elements.statTotal.textContent = total;
  elements.statPresent.textContent = present;
  elements.statLate.textContent = late;
  elements.statAbsent.textContent = absent;
  elements.statRate.textContent = `${rate}%`;
}

// ==========================================================================
// Utility Helpers
// ==========================================================================
function saveToStorage() {
  localStorage.setItem('fsd_attendance_records', JSON.stringify(state.records));
}

function showLoader(isLoading) {
  if (isLoading) {
    elements.tableLoader.classList.remove('hidden');
    elements.emptyState.classList.add('hidden');
  } else {
    elements.tableLoader.classList.add('hidden');
  }
}

function logHttpActivity(method, endpoint, details) {
  const timestamp = new Date().toLocaleTimeString();
  const entry = document.createElement('div');
  entry.className = 'log-entry';

  let methodClass = 'log-info';
  if (method.includes('GET')) methodClass = 'log-get';
  else if (method.includes('POST')) methodClass = 'log-post';
  else if (method.includes('PUT') || method.includes('PATCH')) methodClass = 'log-put';
  else if (method.includes('DELETE')) methodClass = 'log-delete';

  entry.innerHTML = `<span style="color:#64748b;">[${timestamp}]</span> <strong class="${methodClass}">${method}</strong> <span>${endpoint}</span> &rarr; <span style="color:#cbd5e1;">${escapeHtml(details)}</span>`;
  
  elements.httpLogger.prepend(entry);
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
  
  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function exportToCSV() {
  if (state.records.length === 0) {
    showToast('No records available to export', 'warning');
    return;
  }

  const headers = ['ID', 'Roll No', 'Student Name', 'Course', 'Date', 'Status', 'Remarks'];
  const rows = state.records.map(r => [
    r.id,
    `"${r.rollNo}"`,
    `"${r.name}"`,
    `"${r.course}"`,
    r.date,
    r.status,
    `"${r.remarks || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `student_attendance_roll38_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Exported attendance records to CSV successfully!', 'success');
}

function escapeHtml(string) {
  if (string === null || string === undefined) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
