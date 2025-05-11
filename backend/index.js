require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');

// Route imports
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const employeeRoutes = require('./routes/employee');
const employeeDataRoutes = require('./routes/employeeData');
const attendanceController = require('./routes/attendanceController');
const uploadAttendanceRoutes = require('./routes/upload_attendance');

const app = express();

// Middleware
app.use(express.json());

// ✅ CORS Configuration - NO TRAILING SLASH
app.use(cors({
  origin: 'https://attendance-management-eosin.vercel.app', // ✅ Corrected
  credentials: true
}));

// Session Middleware
app.use(session({
  secret: 'your_session_secret', // Use environment variable in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS (e.g., on production with https://)
    maxAge: 60 * 60 * 1000 // 1 hour
  }
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api', employeeDataRoutes);
app.use('/api/attendanceController', attendanceController);
app.use('/api/upload', uploadAttendanceRoutes);

// Test Route
app.get('/', (req, res) => res.send('API is running'));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
