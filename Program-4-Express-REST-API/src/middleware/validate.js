/**
 * Input Validation Middleware
 * Enforces schema validation on incoming JSON payloads
 */

// Validation for Attendance Record Creation / Update
function validateAttendanceInput(req, res, next) {
  const { rollNo, name, status, date } = req.body;
  const errors = [];

  if (!rollNo || String(rollNo).trim() === '') {
    errors.push('Student rollNo is required and cannot be empty.');
  }

  if (!name || String(name).trim() === '') {
    errors.push('Student name is required.');
  } else if (String(name).trim().length < 3) {
    errors.push('Student name must be at least 3 characters.');
  }

  if (status) {
    const validStatuses = ['Present', 'Late', 'Absent'];
    if (!validStatuses.includes(status)) {
      errors.push(`Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}.`);
    }
  }

  if (date) {
    const parsedDate = Date.parse(date);
    if (isNaN(parsedDate)) {
      errors.push('Invalid date format. Expected YYYY-MM-DD.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Input Validation Failed',
      validationErrors: errors
    });
  }

  next();
}

// Validation for User Registration & Authentication
function validateAuthInput(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.push('A valid email address is required.');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Authentication Input Validation Failed',
      validationErrors: errors
    });
  }

  next();
}

module.exports = {
  validateAttendanceInput,
  validateAuthInput
};
