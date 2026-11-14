import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Functional Component: AttendanceForm
 * Demonstrates:
 * - useState (form fields, errors, validation)
 * - useEffect (initializing / editing data)
 * - Event handling (onChange, onSubmit, onReset)
 * - Conditional rendering (error messages, edit vs create mode)
 */
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
  const [successMessage, setSuccessMessage] = useState('');

  // Synchronize form when recordToEdit changes (Demonstrating useEffect)
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
    } else {
      setFormData(prev => ({
        ...prev,
        rollNo: '',
        name: '',
        remarks: '',
        status: 'Present',
        date: new Date().toISOString().split('T')[0]
      }));
    }
  }, [recordToEdit]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validation Logic
  const validateForm = () => {
    const newErrors = {};

    if (!formData.rollNo.trim()) {
      newErrors.rollNo = 'Roll Number is required.';
    } else if (!/^[A-Za-z0-9-]+$/.test(formData.rollNo.trim())) {
      newErrors.rollNo = 'Roll Number must be alphanumeric (e.g., 38 or AD-38).';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Student Name is required.';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Student Name must be at least 3 characters.';
    } else if (!/^[a-zA-Z\s.]+$/.test(formData.name.trim())) {
      newErrors.name = 'Student Name should only contain letters and spaces.';
    }

    if (!formData.date) {
      newErrors.date = 'Attendance date is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      ...formData,
      rollNo: formData.rollNo.trim(),
      name: formData.name.trim(),
      remarks: formData.remarks.trim() || 'General Session'
    };

    onSaveRecord(payload, recordToEdit ? recordToEdit.id : null);

    setSuccessMessage(recordToEdit ? 'Record updated successfully!' : 'Attendance logged successfully!');
    
    // Auto clear success message
    setTimeout(() => {
      setSuccessMessage('');
      // Navigate to records listing view
      navigate('/records');
    }, 1200);
  };

  return (
    <div className="form-container-card">
      <div className="card-headline">
        <h2>{recordToEdit ? '✏️ Edit Attendance Record' : '📝 New Student Attendance Entry'}</h2>
        <p className="card-subhead">
          {recordToEdit 
            ? `Modifying attendance entry for Roll No: ${recordToEdit.rollNo}` 
            : 'Fill in student details and mark their attendance status'}
        </p>
      </div>

      {/* Conditional Rendering: Success Alert */}
      {successMessage && (
        <div className="alert-box alert-success" role="alert">
          <span>✅</span>
          <span>{successMessage}</span>
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
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
            >
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

        {/* Status Selection: Radio Group */}
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
            placeholder="Add relevant notes (e.g. Completed lab practical, On approved medical leave, etc.)"
          />
        </div>

        <div className="form-btn-actions">
          <button type="submit" className="btn-solid-primary">
            {recordToEdit ? '💾 Update Record' : '➕ Save Attendance Record'}
          </button>

          {recordToEdit && onCancelEdit && (
            <button type="button" onClick={onCancelEdit} className="btn-outline-cancel">
              Cancel Edit
            </button>
          )}

          <button 
            type="button" 
            onClick={() => navigate('/records')} 
            className="btn-light-nav"
          >
            View All Records &rarr;
          </button>
        </div>
      </form>
    </div>
  );
}
