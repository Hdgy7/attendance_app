const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const mysql = require('mysql2');
require('dotenv').config();

// Use memory storage (important for deployment on Render)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Upload route
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
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
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: err.message });
      }

      res.json({ message: `✅ Uploaded ${values.length} rows successfully.`, errors });
    });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
