const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ GET all attendance with employee name
router.get('/all', (req, res) => {
  const query = `
    SELECT 
      a.emp_id, 
      e.name, 
      a.date, 
      a.in_time, 
      a.out_time, 
      a.code, 
      a.overtime_hrs 
    FROM attendance a
    JOIN employees e ON a.emp_id = e.emp_no
    ORDER BY a.date DESC;
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ✅ Calculate OT (if work hours > 8)
function calculateOvertime(inTime, outTime) {
  const [h1, m1] = inTime.split(':').map(Number);
  const [h2, m2] = outTime.split(':').map(Number);
  const start = h1 * 60 + m1;
  const end = h2 * 60 + m2;
  const diff = (end - start) / 60;
  return diff > 8 ? parseFloat((diff - 8).toFixed(2)) : 0;
}

// ✅ GET attendance for specific employee
router.get('/employee/:id', (req, res) => {
  const empId = req.params.id;
  db.query(
    'SELECT date, in_time, out_time, code, overtime_hrs FROM attendance WHERE emp_id = ? ORDER BY date',
    [empId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json(result);
    }
  );
});

// ✅ Add or update attendance
router.post('/add', (req, res) => {
  const { emp_id, date, in_time, out_time, code } = req.body;
  const overtime = calculateOvertime(in_time, out_time);

  const sql = `
    INSERT INTO attendance (emp_id, date, in_time, out_time, code, overtime_hrs)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      in_time = VALUES(in_time), 
      out_time = VALUES(out_time), 
      code = VALUES(code), 
      overtime_hrs = VALUES(overtime_hrs);
  `;

  const values = [
    emp_id, date, in_time, out_time, code, overtime
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json({ message: 'Attendance saved', data: result });
  });
});

module.exports = router;
