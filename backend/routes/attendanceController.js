// routes/attendanceController.js

const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Assuming you're using MySQL

// POST route to handle attendance entry (in-time and out-time)
router.post('/att-log', (req, res) => {
  const { emp_id } = req.body;
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date (YYYY-MM-DD)
  const currentTime = new Date().toISOString().split('T')[1].slice(0, 8); // Get current time (HH:MM:SS)

  const checkQuery = 'SELECT * FROM attendance WHERE emp_id = ? AND date = ? AND out_time IS NULL';

  db.query(checkQuery, [emp_id, currentDate], (err, results) => {
    if (err) {
      console.error('Error checking attendance:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length > 0) {
      // If an entry exists, update the out_time
      const updateQuery = 'UPDATE attendance SET out_time = ? WHERE emp_id = ? AND date = ? AND out_time IS NULL';
      db.query(updateQuery, [currentTime, emp_id, currentDate], (err, result) => {
        if (err) {
          console.error('Error updating out_time:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        return res.status(200).json({ message: 'Out-time recorded successfully' });
      });
    } else {
      // If no record exists, insert an in-time entry
      const insertQuery = 'INSERT INTO attendance (emp_id, date, in_time) VALUES (?, ?, ?)';
      db.query(insertQuery, [emp_id, currentDate, currentTime], (err, result) => {
        if (err) {
          console.error('Error inserting in_time:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        return res.status(200).json({ message: 'In-time recorded successfully' });
      });
    }
  });
});

module.exports = router;
