import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import MarkAttendancePage from './pages/MarkAttendancePage';
import RecordsPage from './pages/RecordsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import { INITIAL_STUDENTS } from './data/initialData';
import './App.css';

function App() {
  // Application State using useState
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('react_fsd_attendance_records');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [recordToEdit, setRecordToEdit] = useState(null);
  const [toast, setToast] = useState(null);

  // Synchronize with LocalStorage using useEffect
  useEffect(() => {
    localStorage.setItem('react_fsd_attendance_records', JSON.stringify(records));
  }, [records]);

  // Toast Notification Trigger
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Add or Edit Record Handler
  const handleSaveRecord = (formData, editId) => {
    if (editId) {
      setRecords(prev =>
        prev.map(item => (item.id === editId ? { ...item, ...formData } : item))
      );
      setRecordToEdit(null);
      showToast(`Record for Roll No ${formData.rollNo} updated successfully!`);
    } else {
      const newEntry = {
        id: Date.now(),
        ...formData
      };
      setRecords(prev => [newEntry, ...prev]);
      showToast(`Attendance marked for ${formData.name} (${formData.status})!`);
    }
  };

  // Quick Toggle Status Handler
  const handleToggleStatus = (id) => {
    const statusCycle = { 'Present': 'Late', 'Late': 'Absent', 'Absent': 'Present' };
    setRecords(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextStatus = statusCycle[item.status] || 'Present';
          showToast(`Status updated to ${nextStatus} for ${item.name}`, 'info');
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  // Set Record to Edit
  const handleEditRecord = (record) => {
    setRecordToEdit(record);
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setRecordToEdit(null);
  };

  // Delete Record Handler
  const handleDeleteRecord = (id) => {
    const student = records.find(r => r.id === id);
    if (window.confirm(`Delete attendance record for ${student?.name || 'this student'}?`)) {
      setRecords(prev => prev.filter(item => item.id !== id));
      showToast(`Deleted attendance record for ${student?.name}`, 'warning');
    }
  };

  return (
    <div className="app-layout">
      {/* Top Navigation Bar */}
      <Navbar recordCount={records.length} />

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`floating-toast toast-${toast.type}`}>
          <span>{toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Routed Content Area */}
      <main className="main-content-wrapper">
        <Routes>
          <Route path="/" element={<DashboardPage records={records} />} />
          <Route
            path="/mark"
            element={
              <MarkAttendancePage
                onSaveRecord={handleSaveRecord}
                recordToEdit={recordToEdit}
                onCancelEdit={handleCancelEdit}
              />
            }
          />
          <Route
            path="/records"
            element={
              <RecordsPage
                records={records}
                onToggleStatus={handleToggleStatus}
                onEditRecord={handleEditRecord}
                onDeleteRecord={handleDeleteRecord}
              />
            }
          />
          <Route path="/analytics" element={<AnalyticsPage records={records} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* App Footer */}
      <footer className="footer-bar">
        <p>
          B.E. (AI & DS) Semester V &bull; Student Roll No: <strong>38</strong> &bull; Program 2: React Functional Components, JSX, Props & State (CO3)
        </p>
      </footer>
    </div>
  );
}

export default App;
