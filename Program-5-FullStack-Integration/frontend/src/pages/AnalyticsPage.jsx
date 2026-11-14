import React from 'react';
import StatusBadge from '../components/StatusBadge';

export default function AnalyticsPage({ records = [] }) {
  const total = records.length;
  const present = records.filter(r => r.status === 'Present').length;
  const late = records.filter(r => r.status === 'Late').length;
  const absent = records.filter(r => r.status === 'Absent').length;

  const presentPercent = total > 0 ? Math.round((present / total) * 100) : 0;
  const latePercent = total > 0 ? Math.round((late / total) * 100) : 0;
  const absentPercent = total > 0 ? Math.round((absent / total) * 100) : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>📈 Integrated Analytics & DB Insights</h2>
        <p className="card-subhead">Aggregated metrics retrieved directly from database records</p>
      </div>

      <div className="analytics-metrics-grid">
        <div className="metric-box bg-green-soft">
          <span className="metric-label">Present Ratio</span>
          <span className="metric-big-num text-green">{presentPercent}%</span>
          <span className="metric-hint">{present} of {total} in database</span>
        </div>

        <div className="metric-box bg-amber-soft">
          <span className="metric-label">Late Arrival Ratio</span>
          <span className="metric-big-num text-amber">{latePercent}%</span>
          <span className="metric-hint">{late} of {total} in database</span>
        </div>

        <div className="metric-box bg-red-soft">
          <span className="metric-label">Absenteeism Ratio</span>
          <span className="metric-big-num text-red">{absentPercent}%</span>
          <span className="metric-hint">{absent} of {total} in database</span>
        </div>
      </div>

      {/* Absentee Follow-up Card */}
      <div className="card-box mt-4">
        <h3>⚠️ Absent Students in Database</h3>
        <p className="card-subhead">Records requiring academic counselor intervention</p>

        {records.filter(r => r.status === 'Absent').length === 0 ? (
          <p className="empty-hint">🎉 No absent students recorded in the database!</p>
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
                </tr>
              </thead>
              <tbody>
                {records
                  .filter(r => r.status === 'Absent')
                  .map(student => (
                    <tr key={student.id}>
                      <td><span className="roll-tag">{student.rollNo}</span></td>
                      <td><strong>{student.name}</strong></td>
                      <td>{student.course}</td>
                      <td>{student.date}</td>
                      <td><StatusBadge status="Absent" /></td>
                      <td>{student.remarks || '-'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
