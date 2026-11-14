import React from 'react';

export default function StatSummary({ stats, records = [] }) {
  const total = stats?.total ?? records.length;
  const present = stats?.present ?? records.filter(r => r.status === 'Present').length;
  const late = stats?.late ?? records.filter(r => r.status === 'Late').length;
  const absent = stats?.absent ?? records.filter(r => r.status === 'Absent').length;

  const attendanceRate = total > 0 ? Math.round(((present + (late * 0.5)) / total) * 100) : 0;

  return (
    <div className="stats-grid">
      <div className="kpi-card total-kpi">
        <div className="kpi-icon">👥</div>
        <div className="kpi-info">
          <span className="kpi-label">Total Persisted in DB</span>
          <span className="kpi-val">{total}</span>
        </div>
      </div>

      <div className="kpi-card present-kpi">
        <div className="kpi-icon">✅</div>
        <div className="kpi-info">
          <span className="kpi-label">Present Students</span>
          <span className="kpi-val">{present}</span>
        </div>
      </div>

      <div className="kpi-card late-kpi">
        <div className="kpi-icon">⏱️</div>
        <div className="kpi-info">
          <span className="kpi-label">Late Arrivals</span>
          <span className="kpi-val">{late}</span>
        </div>
      </div>

      <div className="kpi-card absent-kpi">
        <div className="kpi-icon">❌</div>
        <div className="kpi-info">
          <span className="kpi-label">Absent Students</span>
          <span className="kpi-val">{absent}</span>
        </div>
      </div>

      <div className="kpi-card rate-kpi">
        <div className="kpi-icon">📊</div>
        <div className="kpi-info">
          <span className="kpi-label">Attendance Rate</span>
          <span className={`kpi-val ${attendanceRate >= 75 ? 'rate-good' : 'rate-warning'}`}>
            {attendanceRate}%
          </span>
        </div>
      </div>
    </div>
  );
}
