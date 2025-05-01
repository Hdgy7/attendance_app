// backend/routes/employeeData.js
const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const db = require('../config/db'); // Assuming you are using MySQL

router.get('/employee', authenticateUser, (req, res) => {
  const userId = req.user.id; // Access the user ID from the session

  // Query to get employee data
  const query = 'SELECT * FROM users WHERE emp_no = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching employee data:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = results[0];
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  });
});

module.exports = router;
