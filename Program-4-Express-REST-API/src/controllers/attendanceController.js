/**
 * Student Attendance Controller
 * Implements CRUD Operations for Express REST API
 */

const db = require('../data/db');

// GET /api/attendance (Read all records)
function getAllAttendance(req, res, next) {
  try {
    let records = [...db.attendance];
    const { status, search, sortBy } = req.query;

    // Filter by status
    if (status) {
      records = records.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by search keyword
    if (search) {
      const q = search.toLowerCase();
      records = records.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.rollNo.toLowerCase().includes(q) ||
        r.course.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'name') {
      records.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'rollNo') {
      records.sort((a, b) => a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true }));
    } else if (sortBy === 'date') {
      records.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/attendance/:id (Read single record by ID)
function getAttendanceById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const record = db.attendance.find(r => r.id === id);

    if (!record) {
      return res.status(404).json({
        success: false,
        error: `Attendance record with ID ${id} not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/attendance (Create new record - Protected route)
function createAttendance(req, res, next) {
  try {
    const { rollNo, name, course, semester, date, status, remarks } = req.body;

    const newRecord = {
      id: Date.now(),
      rollNo: String(rollNo).trim(),
      name: String(name).trim(),
      course: course || 'B.E. AI & DS',
      semester: semester || 'V',
      date: date || new Date().toISOString().split('T')[0],
      status: status || 'Present',
      remarks: remarks || 'Recorded via Express API',
      createdBy: req.user ? req.user.email : 'system'
    };

    db.attendance.unshift(newRecord);
    db.persist();

    res.status(201).json({
      success: true,
      message: 'Attendance record created successfully.',
      data: newRecord
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/attendance/:id (Update existing record - Protected route)
function updateAttendance(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const index = db.attendance.findIndex(r => r.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: `Cannot update: Record with ID ${id} not found.`
      });
    }

    const { rollNo, name, course, semester, date, status, remarks } = req.body;

    db.attendance[index] = {
      ...db.attendance[index],
      ...(rollNo && { rollNo: String(rollNo).trim() }),
      ...(name && { name: String(name).trim() }),
      ...(course && { course }),
      ...(semester && { semester }),
      ...(date && { date }),
      ...(status && { status }),
      ...(remarks !== undefined && { remarks }),
      updatedBy: req.user ? req.user.email : 'system',
      updatedAt: new Date().toISOString()
    };

    db.persist();

    res.status(200).json({
      success: true,
      message: `Record with ID ${id} updated successfully.`,
      data: db.attendance[index]
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/attendance/:id (Delete record - Protected route)
function deleteAttendance(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const index = db.attendance.findIndex(r => r.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: `Cannot delete: Record with ID ${id} not found.`
      });
    }

    const deletedRecord = db.attendance.splice(index, 1)[0];
    db.persist();

    res.status(200).json({
      success: true,
      message: `Attendance record with ID ${id} removed successfully.`,
      data: deletedRecord
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/attendance/stats (Aggregate Analytics)
function getAttendanceStats(req, res, next) {
  try {
    const total = db.attendance.length;
    const present = db.attendance.filter(r => r.status === 'Present').length;
    const late = db.attendance.filter(r => r.status === 'Late').length;
    const absent = db.attendance.filter(r => r.status === 'Absent').length;
    const rate = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalRecords: total,
        present,
        late,
        absent,
        effectiveRate: `${rate}%`
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceStats
};
