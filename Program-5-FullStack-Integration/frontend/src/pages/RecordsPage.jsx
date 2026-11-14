import React from 'react';
import AttendanceList from '../components/AttendanceList';

export default function RecordsPage({
  records,
  loading,
  onToggleStatus,
  onEditRecord,
  onDeleteRecord,
  onRefresh
}) {
  return (
    <div className="page-container">
      <AttendanceList
        records={records}
        loading={loading}
        onToggleStatus={onToggleStatus}
        onEditRecord={onEditRecord}
        onDeleteRecord={onDeleteRecord}
        onRefresh={onRefresh}
      />
    </div>
  );
}
