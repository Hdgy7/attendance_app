const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Your User model
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'; // Replace in production

// Helper to generate token
function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
}

// General login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (!results || results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];

    if (user.password_hash === password) {
      const token = generateToken(user);
      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// Employee-specific login
router.post('/employee-login', (req, res) => {
  const { empid, password } = req.body;

  User.findByEmpId(empid, (err, results) => {
    if (err || !results.length) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    if (user.role !== 'employee') {
      return res.status(403).json({ message: 'Access denied: Not an employee' });
    }

    if (user.password_hash === password) {
      const token = generateToken(user);
      return res.json({
        message: 'Employee login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      return res.status(401).json({ message: 'Incorrect password' });
    }
  });
});

module.exports = router;
