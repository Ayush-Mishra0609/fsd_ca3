import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatSummary from '../components/StatSummary';
import StatusBadge from '../components/StatusBadge';

export default function DashboardPage({ records = [] }) {
  const navigate = useNavigate();

  const recentRecords = records.slice(0, 5);

  const presentCount = records.filter(r => r.status === 'Present').length;
  const lateCount = records.filter(r => r.status === 'Late').length;
  const absentCount = records.filter(r => r.status === 'Absent').length;
  const total = records.length;
  const attendanceRate = total > 0 ? Math.round(((presentCount + (lateCount * 0.5)) / total) * 100) : 0;

  return (
    <div className="page-container">
      {/* Student Identification Banner */}
      <div className="welcome-banner">
        <div>
          <span className="pill-badge">B.E. AI & DS • Semester V</span>
          <h1 className="banner-title">Welcome to Student Attendance Portal</h1>
          <p className="banner-desc">
            Full Stack Practical Assignment CO3 &bull; React Functional Components, JSX, Props, State, and Routing.
          </p>
        </div>
        <div className="banner-meta-badge">
          <span className="banner-roll">Roll No: 38</span>
          <span className="banner-dept">Dept of AI & DS</span>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <StatSummary records={records} />

      {/* Attendance Goal / Progress Indicator */}
      <div className="card-box progress-card">
        <div className="progress-header">
          <div>
            <h3>Overall Class Attendance Compliance</h3>
            <p className="card-subhead">Minimum university threshold target is 75%</p>
          </div>
          <span className="progress-percentage-pill">{attendanceRate}%</span>
        </div>
        <div className="progress-bar-track">
          <div 
            className={`progress-bar-fill ${attendanceRate >= 75 ? 'fill-good' : 'fill-warning'}`}
            style={{ width: `${Math.min(attendanceRate, 100)}%` }}
          />
        </div>
        <div className="progress-legend">
          <span>● Present: {presentCount}</span>
          <span>▲ Late: {lateCount}</span>
          <span>■ Absent: {absentCount}</span>
        </div>
      </div>

      {/* Quick Action Cards & Recent Records */}
      <div className="dashboard-two-col">
        {/* Quick Launchpad */}
        <div className="card-box launchpad-card">
          <h3>⚡ Quick Actions</h3>
          <p className="card-subhead">Frequently used attendance management workflows</p>

          <div className="action-buttons-list">
            <button onClick={() => navigate('/mark')} className="action-btn-row">
              <span className="action-row-icon">📝</span>
              <div className="action-row-text">
                <span className="action-title">Mark New Attendance</span>
                <span className="action-desc">Record attendance for today's lecture or lab</span>
              </div>
              <span className="action-arrow">&rarr;</span>
            </button>

            <button onClick={() => navigate('/records')} className="action-btn-row">
              <span className="action-row-icon">📋</span>
              <div className="action-row-text">
                <span className="action-title">View All Student Records</span>
                <span className="action-desc">Filter, search, sort, and edit entries</span>
              </div>
              <span className="action-arrow">&rarr;</span>
            </button>

            <button onClick={() => navigate('/analytics')} className="action-btn-row">
              <span className="action-row-icon">📈</span>
              <div className="action-row-text">
                <span className="action-title">Department Analytics</span>
                <span className="action-desc">View attendance trends and department summaries</span>
              </div>
              <span className="action-arrow">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Recently Added Attendance Records */}
        <div className="card-box recent-records-card">
          <div className="card-header-flex">
            <h3>🕒 Recent Attendance Logs</h3>
            <button onClick={() => navigate('/records')} className="btn-link">View All ({records.length})</button>
          </div>
          <p className="card-subhead">Latest students marked in the system</p>

          {recentRecords.length === 0 ? (
            <p className="empty-hint">No recent records available.</p>
          ) : (
            <ul className="recent-list">
              {recentRecords.map(item => (
                <li key={item.id} className="recent-item">
                  <div className="recent-item-meta">
                    <span className="roll-tag-sm">{item.rollNo}</span>
                    <span className="recent-name">{item.name}</span>
                  </div>
                  <div className="recent-item-right">
                    <span className="recent-date">{item.date}</span>
                    <StatusBadge status={item.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
