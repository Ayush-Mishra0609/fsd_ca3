import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatSummary from '../components/StatSummary';
import StatusBadge from '../components/StatusBadge';

export default function DashboardPage({ records = [], stats, isBackendOnline }) {
  const navigate = useNavigate();
  const recentRecords = records.slice(0, 5);

  return (
    <div className="page-container">
      {/* Full-Stack Banner */}
      <div className="welcome-banner fullstack-banner">
        <div>
          <div className="banner-pills-row">
            <span className="pill-badge">B.E. AI & DS • Semester V</span>
            <span className="pill-badge deploy-pill">🚀 Vercel (Frontend) + Render (Backend)</span>
          </div>
          <h1 className="banner-title">Full-Stack Student Attendance Portal</h1>
          <p className="banner-desc">
            Practical Program 5 (CO6) &mdash; Integrated React Single-Page Application, Express.js REST API & Database Persistence (PostgreSQL / SQLite via Sequelize ORM).
          </p>
        </div>
        <div className="banner-meta-badge">
          <span className="banner-roll">Roll No: 38</span>
          <span className="banner-dept">Dept of AI & DS</span>
          <span className="banner-status-tag">
            {isBackendOnline ? '🟢 Connected to API' : '🟡 Standalone Mode'}
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <StatSummary stats={stats} records={records} />

      {/* Two-Column Dashboard */}
      <div className="dashboard-two-col">
        {/* Architecture & Deployment Info */}
        <div className="card-box">
          <h3>🏗️ Full-Stack Architecture</h3>
          <p className="card-subhead">Course Outcome CO6 Implementation Highlights</p>

          <ul className="feature-checklist">
            <li>
              <strong>Frontend Client:</strong> React 18 SPA built with Vite, styled with modern responsive CSS, deployed on <strong>Vercel</strong> with <code>vercel.json</code> rewrites.
            </li>
            <li>
              <strong>Backend REST API:</strong> Express.js server configured with dynamic CORS and environment variables, deployed on <strong>Render</strong> with <code>render.yaml</code>.
            </li>
            <li>
              <strong>Database Persistence:</strong> Persistent records using <strong>Sequelize ORM</strong> connected to PostgreSQL on Render / SQLite for local development.
            </li>
            <li>
              <strong>Environment Variables:</strong> Configured via <code>.env</code> (<code>VITE_API_URL</code> on client, <code>DATABASE_URL</code> & <code>FRONTEND_URL</code> on server).
            </li>
          </ul>

          <div className="mt-4">
            <button onClick={() => navigate('/mark')} className="btn-solid-primary mr-2">
              ➕ Mark Attendance Now
            </button>
            <button onClick={() => navigate('/records')} className="btn-light-nav">
              View Database Records
            </button>
          </div>
        </div>

        {/* Recent Database Records */}
        <div className="card-box">
          <div className="card-header-flex">
            <h3>🗄️ Recent Database Records</h3>
            <button onClick={() => navigate('/records')} className="btn-link">View All ({records.length})</button>
          </div>
          <p className="card-subhead">Latest students persisted in database</p>

          {recentRecords.length === 0 ? (
            <p className="empty-hint">No database records found. Click 'Mark Attendance' to add one!</p>
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
