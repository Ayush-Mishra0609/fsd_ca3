import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ recordCount, isBackendOnline }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="brand-icon">🌐</span>
          <div>
            <div className="brand-title">AttendFullStack</div>
            <div className="brand-subtitle">React + Express + PostgreSQL/Sequelize (CO6)</div>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <span>📊</span> Dashboard
          </NavLink>
          <NavLink to="/mark" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <span>📝</span> Mark Attendance
          </NavLink>
          <NavLink to="/records" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <span>📋</span> Records ({recordCount})
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <span>📈</span> Analytics
          </NavLink>
        </nav>

        <div className="nav-meta-group">
          <span className={`server-status-dot ${isBackendOnline ? 'online' : 'offline'}`} title={isBackendOnline ? 'Backend API Connected' : 'Backend Disconnected'}>
            {isBackendOnline ? '● API Online' : '○ Standalone / Local'}
          </span>
          <span className="roll-pill">Roll 38</span>
          <span className="dept-tag">AI & DS</span>
        </div>
      </div>
    </header>
  );
}
