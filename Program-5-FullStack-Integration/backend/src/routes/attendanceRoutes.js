/**
 * Attendance API Routes (Sequelize ORM Integration)
 * Roll No: 38 | Dept: AI & DS | CO6
 */

const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { Op } = require('sequelize');

// GET /api/attendance (Read all records from DB)
router.get('/', async (req, res) => {
  try {
    const { status, search, sortBy } = req.query;
    const whereClause = {};

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { rollNo: { [Op.like]: `%${search}%` } },
        { remarks: { [Op.like]: `%${search}%` } }
      ];
    }

    let order = [['createdAt', 'DESC']];
    if (sortBy === 'rollNo-asc') order = [['rollNo', 'ASC']];
    else if (sortBy === 'rollNo-desc') order = [['rollNo', 'DESC']];
    else if (sortBy === 'name-asc') order = [['name', 'ASC']];
    else if (sortBy === 'name-desc') order = [['name', 'DESC']];
    else if (sortBy === 'date-desc') order = [['date', 'DESC']];

    const records = await Attendance.findAll({
      where: whereClause,
      order: order
    });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Error fetching attendance from DB:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/attendance/stats (Aggregate Analytics from DB)
router.get('/stats', async (req, res) => {
  try {
    const total = await Attendance.count();
    const present = await Attendance.count({ where: { status: 'Present' } });
    const late = await Attendance.count({ where: { status: 'Late' } });
    const absent = await Attendance.count({ where: { status: 'Absent' } });
    const attendanceRate = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        total,
        present,
        late,
        absent,
        attendanceRate: `${attendanceRate}%`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/attendance/:id (Get single record)
router.get('/:id', async (req, res) => {
  try {
    const record = await Attendance.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/attendance (Create new record in DB)
router.post('/', async (req, res) => {
  try {
    const { rollNo, name, course, semester, date, status, remarks } = req.body;

    if (!rollNo || !name) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: rollNo and name are required fields.'
      });
    }

    const newRecord = await Attendance.create({
      rollNo: String(rollNo).trim(),
      name: String(name).trim(),
      course: course || 'B.E. AI & DS',
      semester: semester || 'Semester V',
      date: date || new Date().toISOString().split('T')[0],
      status: status || 'Present',
      remarks: remarks || 'Persisted via Sequelize'
    });

    res.status(201).json({
      success: true,
      message: 'Attendance record persisted to database successfully.',
      data: newRecord
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT /api/attendance/:id (Update record in DB)
router.put('/:id', async (req, res) => {
  try {
    const record = await Attendance.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, error: 'Record not found to update.' });
    }

    const { rollNo, name, course, semester, date, status, remarks } = req.body;

    await record.update({
      ...(rollNo && { rollNo: String(rollNo).trim() }),
      ...(name && { name: String(name).trim() }),
      ...(course && { course }),
      ...(semester && { semester }),
      ...(date && { date }),
      ...(status && { status }),
      ...(remarks !== undefined && { remarks })
    });

    res.status(200).json({
      success: true,
      message: 'Record updated successfully in database.',
      data: record
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /api/attendance/:id (Delete record from DB)
router.delete('/:id', async (req, res) => {
  try {
    const record = await Attendance.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, error: 'Record not found to delete.' });
    }

    await record.destroy();

    res.status(200).json({
      success: true,
      message: 'Record removed from database successfully.',
      deletedId: req.params.id
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
