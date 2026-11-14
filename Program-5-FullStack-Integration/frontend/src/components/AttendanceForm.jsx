import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AttendanceForm({ onSaveRecord, recordToEdit = null, onCancelEdit = null }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rollNo: '',
    name: '',
    course: 'B.E. AI & DS',
    semester: 'Semester V',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    remarks: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (recordToEdit) {
      setFormData({
        rollNo: recordToEdit.rollNo || '',
        name: recordToEdit.name || '',
        course: recordToEdit.course || 'B.E. AI & DS',
        semester: recordToEdit.semester || 'Semester V',
        date: recordToEdit.date || new Date().toISOString().split('T')[0],
        status: recordToEdit.status || 'Present',
        remarks: recordToEdit.remarks || ''
      });
    }
  }, [recordToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.rollNo.trim()) errs.rollNo = 'Roll number is required';
    if (!formData.name.trim()) errs.name = 'Student name is required';
    if (!formData.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSaveRecord(formData, recordToEdit ? recordToEdit.id : null);
      navigate('/records');
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container-card">
      <div className="card-headline">
        <h2>{recordToEdit ? '✏️ Edit Database Record' : '📝 Persist New Attendance'}</h2>
        <p className="card-subhead">Data is directly synchronized and saved to the backend database</p>
      </div>

      {errors.form && (
        <div className="alert-box alert-error">
          <span>❌</span>
          <span>{errors.form}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-col">
            <label htmlFor="rollNo">Student Roll Number <span className="text-danger">*</span></label>
            <input
              type="text"
              id="rollNo"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleChange}
              placeholder="e.g. 38"
              className={errors.rollNo ? 'input-invalid' : ''}
            />
            {errors.rollNo && <span className="field-error">{errors.rollNo}</span>}
          </div>

          <div className="form-col">
            <label htmlFor="name">Student Full Name <span className="text-danger">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ayush Sharma"
              className={errors.name ? 'input-invalid' : ''}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <label htmlFor="course">Department / Program</label>
            <select id="course" name="course" value={formData.course} onChange={handleChange}>
              <option value="B.E. AI & DS">B.E. AI & DS</option>
              <option value="B.E. Computer Engg">B.E. Computer Engg</option>
              <option value="B.E. IT">B.E. IT</option>
              <option value="B.E. Data Science">B.E. Data Science</option>
            </select>
          </div>

          <div className="form-col">
            <label htmlFor="date">Attendance Date <span className="text-danger">*</span></label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'input-invalid' : ''}
            />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </div>
        </div>

        <div className="form-section">
          <label className="section-label">Attendance Status <span className="text-danger">*</span></label>
          <div className="status-selector">
            {['Present', 'Late', 'Absent'].map(statusOption => (
              <label 
                key={statusOption}
                className={`status-chip-radio ${formData.status === statusOption ? `active-${statusOption.toLowerCase()}` : ''}`}
              >
                <input
                  type="radio"
                  name="status"
                  value={statusOption}
                  checked={formData.status === statusOption}
                  onChange={handleChange}
                />
                <span className="status-chip-text">
                  {statusOption === 'Present' && '● '}
                  {statusOption === 'Late' && '▲ '}
                  {statusOption === 'Absent' && '■ '}
                  {statusOption}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="remarks">Session Remarks / Notes</label>
          <textarea
            id="remarks"
            name="remarks"
            rows="3"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Persisted notes in database..."
          />
        </div>

        <div className="form-btn-actions">
          <button type="submit" className="btn-solid-primary" disabled={submitting}>
            {submitting ? 'Saving to Database...' : recordToEdit ? '💾 Update DB Record' : '➕ Persist to Database'}
          </button>
          {recordToEdit && onCancelEdit && (
            <button type="button" onClick={onCancelEdit} className="btn-outline-cancel">
              Cancel
            </button>
          )}
          <button type="button" onClick={() => navigate('/records')} className="btn-light-nav">
            View DB Records &rarr;
          </button>
        </div>
      </form>
    </div>
  );
}
