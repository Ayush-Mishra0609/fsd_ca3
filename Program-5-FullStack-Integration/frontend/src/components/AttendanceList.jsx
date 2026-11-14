import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { useNavigate } from 'react-router-dom';

export default function AttendanceList({
  records = [],
  loading = false,
  onToggleStatus,
  onEditRecord,
  onDeleteRecord,
  onRefresh
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('rollNo-asc');

  const filtered = records
    .filter(r => {
      if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.rollNo.toLowerCase().includes(q) ||
          (r.remarks && r.remarks.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rollNo-asc') return a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true });
      if (sortBy === 'rollNo-desc') return b.rollNo.localeCompare(a.rollNo, undefined, { numeric: true });
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return new Date(b.date) - new Date(a.date);
    });

  const handleEdit = (record) => {
    onEditRecord(record);
    navigate('/mark');
  };

  return (
    <div className="list-wrapper-card">
      <div className="list-header-row">
        <div>
          <h2>📋 Database Attendance Records</h2>
          <p className="card-subhead">
            Showing {filtered.length} of {records.length} records stored in database
          </p>
        </div>

        <div className="header-action-group">
          <button onClick={onRefresh} className="btn-light-nav" title="Refresh from API">
            🔄 Refresh DB
          </button>
          <button onClick={() => navigate('/mark')} className="btn-solid-primary">
            ➕ Mark Attendance
          </button>
        </div>
      </div>

      <div className="filter-controls-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search student in database..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-pills-group">
          {['ALL', 'Present', 'Late', 'Absent'].map(status => (
            <button
              key={status}
              type="button"
              className={`filter-pill ${filterStatus === status ? 'pill-active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'ALL' ? 'All' : status}
            </button>
          ))}
        </div>

        <div className="sort-group">
          <label>Sort:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="rollNo-asc">Roll No (Ascending)</option>
            <option value="rollNo-desc">Roll No (Descending)</option>
            <option value="name-asc">Name (A &rarr; Z)</option>
            <option value="date-desc">Date (Newest)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="empty-listing-box">
          <div className="spinner"></div>
          <p className="mt-2">Connecting to Backend API...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-listing-box">
          <div className="empty-icon">📭</div>
          <h3>No Records Found in Database</h3>
          <p>Mark attendance using the form to persist records into PostgreSQL / SQLite.</p>
        </div>
      ) : (
        <div className="table-responsive-wrapper">
          <table className="react-attendance-table">
            <thead>
              <tr>
                <th>DB ID</th>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Department</th>
                <th>Date</th>
                <th>Status</th>
                <th>Remarks</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(record => (
                <tr key={record.id}>
                  <td><code className="text-muted">#{record.id}</code></td>
                  <td><span className="roll-tag">{record.rollNo}</span></td>
                  <td><strong>{record.name}</strong></td>
                  <td><span className="text-subtle">{record.course}</span></td>
                  <td>{record.date}</td>
                  <td><StatusBadge status={record.status} /></td>
                  <td><span className="text-subtle">{record.remarks || '-'}</span></td>
                  <td className="text-right">
                    <div className="action-buttons-cell">
                      <button
                        type="button"
                        className="btn-icon-action btn-cycle"
                        title="Toggle Status (triggers API PUT)"
                        onClick={() => onToggleStatus(record)}
                      >
                        🔄
                      </button>
                      <button
                        type="button"
                        className="btn-icon-action btn-edit"
                        title="Edit in DB"
                        onClick={() => handleEdit(record)}
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        className="btn-icon-action btn-del"
                        title="Delete from DB"
                        onClick={() => onDeleteRecord(record.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
