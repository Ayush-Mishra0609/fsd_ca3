import React from 'react';
import AttendanceForm from '../components/AttendanceForm';

export default function MarkAttendancePage({ onSaveRecord, recordToEdit, onCancelEdit }) {
  return (
    <div className="page-container page-narrow">
      <AttendanceForm
        onSaveRecord={onSaveRecord}
        recordToEdit={recordToEdit}
        onCancelEdit={onCancelEdit}
      />
    </div>
  );
}
