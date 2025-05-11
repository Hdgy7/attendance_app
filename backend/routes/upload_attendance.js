const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const db = require('../config/db'); // ✅ Reuse DB connection

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Upload route
router.post('/', upload.single('file'), (req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { raw: false });

  const values = [];
  const errors = [];

  data.forEach((row, index) => {
    const empId = row.emp_id ? String(row.emp_id).trim() : null;
    const date = row.date;

    if (!empId || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push(`Row ${index + 2}: Invalid emp_id or date (${empId}, ${date})`);
      return;
    }

    values.push([
      empId,
      date,
      row.in_time || null,
      row.out_time || null,
      row.code || null,
      row.overtime_hrs || 0
    ]);
  });

  if (values.length === 0) {
    return res.status(400).json({ message: 'No valid rows to insert.', errors });
  }

  const sql = `INSERT INTO attendance (emp_id, date, in_time, out_time, code, overtime_hrs)
               VALUES ?`;

  db.query(sql, [values], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: `✅ Uploaded ${values.length} rows successfully.`, errors });
  });
});

module.exports = router;
