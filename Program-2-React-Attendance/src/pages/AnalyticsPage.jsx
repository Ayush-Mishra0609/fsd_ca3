import React from 'react';
import StatusBadge from '../components/StatusBadge';

export default function AnalyticsPage({ records = [] }) {
  const total = records.length;
  const present = records.filter(r => r.status === 'Present').length;
  const late = records.filter(r => r.status === 'Late').length;
  const absent = records.filter(r => r.status === 'Absent').length;

  // Breakdown by course
  const courseBreakdown = records.reduce((acc, curr) => {
    const course = curr.course || 'Other';
    if (!acc[course]) {
      acc[course] = { total: 0, present: 0, late: 0, absent: 0 };
    }
    acc[course].total += 1;
    if (curr.status === 'Present') acc[course].present += 1;
    if (curr.status === 'Late') acc[course].late += 1;
    if (curr.status === 'Absent') acc[course].absent += 1;
    return acc;
  }, {});

  const presentPercent = total > 0 ? Math.round((present / total) * 100) : 0;
  const latePercent = total > 0 ? Math.round((late / total) * 100) : 0;
  const absentPercent = total > 0 ? Math.round((absent / total) * 100) : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>📈 Attendance Analytics & Insights</h2>
        <p className="card-subhead">Visual statistical breakdown across departments and attendance statuses</p>
      </div>

      {/* Analytics Summary Cards */}
      <div className="analytics-metrics-grid">
        <div className="metric-box bg-green-soft">
          <span className="metric-label">Present Ratio</span>
          <span className="metric-big-num text-green">{presentPercent}%</span>
          <span className="metric-hint">{present} out of {total} records</span>
        </div>

        <div className="metric-box bg-amber-soft">
          <span className="metric-label">Late Arrival Ratio</span>
          <span className="metric-big-num text-amber">{latePercent}%</span>
          <span className="metric-hint">{late} out of {total} records</span>
        </div>

        <div className="metric-box bg-red-soft">
          <span className="metric-label">Absenteeism Ratio</span>
          <span className="metric-big-num text-red">{absentPercent}%</span>
          <span className="metric-hint">{absent} out of {total} records</span>
        </div>
      </div>

      {/* Department Wise Attendance Breakdown Table */}
      <div className="card-box mt-4">
        <h3>🏛️ Departmental Breakdown</h3>
        <p className="card-subhead">Detailed attendance statistics grouped by department/course</p>

        <div className="table-responsive-wrapper">
          <table className="react-attendance-table">
            <thead>
              <tr>
                <th>Department / Course</th>
                <th>Total Enrolled</th>
                <th>Present</th>
                <th>Late</th>
                <th>Absent</th>
                <th>Attendance Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(courseBreakdown).map(course => {
                const data = courseBreakdown[course];
                const deptRate = data.total > 0 
                  ? Math.round(((data.present + data.late * 0.5) / data.total) * 100) 
                  : 0;

                return (
                  <tr key={course}>
                    <td><strong>{course}</strong></td>
                    <td>{data.total}</td>
                    <td><span className="text-green font-semibold">{data.present}</span></td>
                    <td><span className="text-amber font-semibold">{data.late}</span></td>
                    <td><span className="text-red font-semibold">{data.absent}</span></td>
                    <td>
                      <span className={`badge ${deptRate >= 75 ? 'badge-present' : 'badge-absent'}`}>
                        {deptRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Attention Students (Absentee List) */}
      <div className="card-box mt-4">
        <h3>⚠️ Students Marked Absent</h3>
        <p className="card-subhead">Students who require follow-up or medical documentation verification</p>

        {records.filter(r => r.status === 'Absent').length === 0 ? (
          <p className="empty-hint">🎉 No students marked absent today!</p>
        ) : (
          <div className="table-responsive-wrapper">
            <table className="react-attendance-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Remarks / Reason</th>
                </tr>
              </thead>
              <tbody>
                {records
                  .filter(r => r.status === 'Absent')
                  .map(student => (
                    <tr key={student.id}>
                      <td><span className="roll-tag">{student.rollNo}</span></td>
                      <td><strong>{student.name}</strong></td>
                      <td>{student.date}</td>
                      <td><StatusBadge status="Absent" /></td>
                      <td>{student.remarks || 'No remarks provided'}</td>
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
