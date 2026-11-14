import React, { useState, useMemo } from 'react';
import StatusBadge from './StatusBadge';
import { useNavigate } from 'react-router-dom';

/**
 * Functional Component: AttendanceList
 * Demonstrates:
 * - Listing view of records
 * - Filtering, searching, sorting using useMemo
 * - Conditional rendering (empty states, badges)
 * - Event handling (toggling, editing, deleting)
 */
export default function AttendanceList({ 
  records = [], 
  onToggleStatus, 
  onEditRecord, 
  onDeleteRecord 
}) {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('rollNo-asc');

  // Filter & Sort Logic using useMemo for performance
  const filteredRecords = useMemo(() => {
    return records
      .filter(record => {
        // Status Filter
        if (filterStatus !== 'ALL' && record.status !== filterStatus) {
          return false;
        }
        // Search Query Filter
        if (searchTerm.trim() !== '') {
          const q = searchTerm.toLowerCase();
          const matchName = record.name.toLowerCase().includes(q);
          const matchRoll = record.rollNo.toLowerCase().includes(q);
          const matchRemarks = (record.remarks || '').toLowerCase().includes(q);
          const matchCourse = record.course.toLowerCase().includes(q);
          return matchName || matchRoll || matchRemarks || matchCourse;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
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
          default:
            return 0;
        }
      });
  }, [records, searchTerm, filterStatus, sortBy]);

  const handleEditClick = (record) => {
    onEditRecord(record);
    navigate('/mark');
  };

  return (
    <div className="list-wrapper-card">
      <div className="list-header-row">
        <div>
          <h2>📋 Student Attendance Listing</h2>
          <p className="card-subhead">
            Showing {filteredRecords.length} of {records.length} registered records
          </p>
        </div>

        <button 
          onClick={() => navigate('/mark')} 
          className="btn-solid-primary"
        >
          ➕ Mark New Student
        </button>
      </div>

      {/* Controls Bar: Search, Filter Tabs, Sort */}
      <div className="filter-controls-bar">
        {/* Search Bar */}
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search student name, roll no, remarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="clear-search-btn" 
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
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

        {/* Sort Select */}
        <div className="sort-group">
          <label htmlFor="sortSelect">Sort:</label>
          <select
            id="sortSelect"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rollNo-asc">Roll No (Low &rarr; High)</option>
            <option value="rollNo-desc">Roll No (High &rarr; Low)</option>
            <option value="name-asc">Name (A &rarr; Z)</option>
            <option value="name-desc">Name (Z &rarr; A)</option>
            <option value="date-desc">Date (Newest First)</option>
          </select>
        </div>
      </div>

      {/* Conditional Rendering: Empty State vs Records Table */}
      {filteredRecords.length === 0 ? (
        <div className="empty-listing-box">
          <div className="empty-icon">📭</div>
          <h3>No Attendance Records Found</h3>
          <p>
            {searchTerm || filterStatus !== 'ALL'
              ? 'No student matches your current filter/search criteria.'
              : 'Start by marking attendance for your students!'}
          </p>
          {(searchTerm || filterStatus !== 'ALL') && (
            <button 
              className="btn-light-nav"
              onClick={() => { setSearchTerm(''); setFilterStatus('ALL'); }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="table-responsive-wrapper">
          <table className="react-attendance-table">
            <thead>
              <tr>
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
              {filteredRecords.map(record => (
                <tr key={record.id}>
                  <td>
                    <span className="roll-tag">{record.rollNo}</span>
                  </td>
                  <td>
                    <div className="student-profile">
                      <span className="avatar-circle">{record.name.charAt(0)}</span>
                      <span className="student-title">{record.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-subtle">{record.course}</span>
                  </td>
                  <td>{record.date}</td>
                  <td>
                    <StatusBadge status={record.status} />
                  </td>
                  <td>
                    <span className="text-subtle remarks-truncate" title={record.remarks}>
                      {record.remarks || '-'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="action-buttons-cell">
                      <button
                        type="button"
                        className="btn-icon-action btn-cycle"
                        title="Cycle Status (Present -> Late -> Absent)"
                        onClick={() => onToggleStatus(record.id)}
                      >
                        🔄 Toggle
                      </button>
                      <button
                        type="button"
                        className="btn-icon-action btn-edit"
                        title="Edit Record"
                        onClick={() => handleEditClick(record)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="btn-icon-action btn-del"
                        title="Delete Record"
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
