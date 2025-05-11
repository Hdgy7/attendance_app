require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const employeeRoutes = require('./routes/employee');
const employeeDataRoutes = require('./routes/employeeData');
const attendanceController = require('./routes/attendanceController');
const uploadAttendanceRoutes = require('./routes/upload_attendance'); // Path to your controller
const app = express();
 // Load .env variables

// Enable JSON parsing
app.use(express.json());

// CORS Configuration (withCredentials for frontend session support)
app.use(cors({
  origin: 'https://attendance-management-eosin.vercel.app/', // Replace with your frontend's URL
  credentials: true
}));


// Session Middleware
app.use(session({
  secret: 'your_session_secret', // Use strong secret in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set to true in production (HTTPS)
    maxAge: 60 * 60 * 1000 // 1 hour
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api', employeeDataRoutes); // Employee data access
app.use('/api/attendanceController', attendanceController);
app.use('/api/upload', uploadAttendanceRoutes);


// Test route
app.get('/', (req, res) => res.send('API is running'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
