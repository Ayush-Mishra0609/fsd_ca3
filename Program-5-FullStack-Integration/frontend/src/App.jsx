import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import MarkAttendancePage from './pages/MarkAttendancePage';
import RecordsPage from './pages/RecordsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import { api } from './services/api';
import './App.css';

// Fallback seed data if backend is offline
const LOCAL_FALLBACK = [
  { id: 1, rollNo: "38", name: "Ayush Sharma", course: "B.E. AI & DS", semester: "Semester V", date: "2026-11-14", status: "Present", remarks: "Full stack integrated" },
  { id: 2, rollNo: "01", name: "Aarav Patel", course: "B.E. AI & DS", semester: "Semester V", date: "2026-11-14", status: "Present", remarks: "Database synced" },
  { id: 3, rollNo: "12", name: "Bhavya Rao", course: "B.E. AI & DS", semester: "Semester V", date: "2026-11-14", status: "Absent", remarks: "Medical certificate" },
  { id: 4, rollNo: "24", name: "Devansh Mehta", course: "B.E. AI & DS", semester: "Semester V", date: "2026-11-14", status: "Late", remarks: "Transit delay" }
];

function App() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load records from API
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getAllAttendance();
      if (res.success && res.data) {
        setRecords(res.data);
        setIsBackendOnline(true);
      }
      
      const statsRes = await api.getStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.warn('Could not connect to Express API, using local offline fallback.', err.message);
      setIsBackendOnline(false);
      setRecords(LOCAL_FALLBACK);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Create or Update Record
  const handleSaveRecord = async (formData, editId) => {
    try {
      if (editId) {
        if (isBackendOnline) {
          await api.updateAttendance(editId, formData);
        } else {
          setRecords(prev => prev.map(r => r.id === editId ? { ...r, ...formData } : r));
        }
        showToast(`Record updated for Roll No: ${formData.rollNo}`);
      } else {
        if (isBackendOnline) {
          await api.createAttendance(formData);
        } else {
          setRecords(prev => [{ id: Date.now(), ...formData }, ...prev]);
        }
        showToast(`Attendance recorded for ${formData.name}`);
      }
      setRecordToEdit(null);
      if (isBackendOnline) await loadData();
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Toggle Status
  const handleToggleStatus = async (record) => {
    const cycle = { 'Present': 'Late', 'Late': 'Absent', 'Absent': 'Present' };
    const nextStatus = cycle[record.status] || 'Present';

    try {
      if (isBackendOnline) {
        await api.updateAttendance(record.id, { status: nextStatus });
        await loadData();
      } else {
        setRecords(prev => prev.map(r => r.id === record.id ? { ...r, status: nextStatus } : r));
      }
      showToast(`Status changed to ${nextStatus} for ${record.name}`);
    } catch (err) {
      showToast('Failed to update status in DB', 'error');
    }
  };

  // Delete Record
  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record from the database?')) return;

    try {
      if (isBackendOnline) {
        await api.deleteAttendance(id);
        await loadData();
      } else {
        setRecords(prev => prev.filter(r => r.id !== id));
      }
      showToast('Record deleted from database successfully', 'warning');
    } catch (err) {
      showToast('Failed to delete record from DB', 'error');
    }
  };

  return (
    <div className="app-layout">
      <Navbar recordCount={records.length} isBackendOnline={isBackendOnline} />

      {toast && (
        <div className={`floating-toast toast-${toast.type}`}>
          <span>{toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      <main className="main-content-wrapper">
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                records={records}
                stats={stats}
                isBackendOnline={isBackendOnline}
              />
            }
          />
          <Route
            path="/mark"
            element={
              <MarkAttendancePage
                onSaveRecord={handleSaveRecord}
                recordToEdit={recordToEdit}
                onCancelEdit={() => setRecordToEdit(null)}
              />
            }
          />
          <Route
            path="/records"
            element={
              <RecordsPage
                records={records}
                loading={loading}
                onToggleStatus={handleToggleStatus}
                onEditRecord={setRecordToEdit}
                onDeleteRecord={handleDeleteRecord}
                onRefresh={loadData}
              />
            }
          />
          <Route path="/analytics" element={<AnalyticsPage records={records} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="footer-bar">
        <p>
          B.E. (AI & DS) Semester V &bull; Student Roll No: <strong>38</strong> &bull; Program 5: Full-Stack React + Express + Sequelize/PostgreSQL Integration (CO6)
        </p>
      </footer>
    </div>
  );
}

export default App;
