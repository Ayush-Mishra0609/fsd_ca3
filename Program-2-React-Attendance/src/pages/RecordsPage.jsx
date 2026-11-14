import React from 'react';
import AttendanceList from '../components/AttendanceList';

export default function RecordsPage({
  records,
  onToggleStatus,
  onEditRecord,
  onDeleteRecord
}) {
  return (
    <div className="page-container">
      <AttendanceList
        records={records}
        onToggleStatus={onToggleStatus}
        onEditRecord={onEditRecord}
        onDeleteRecord={onDeleteRecord}
      />
    </div>
  );
}
