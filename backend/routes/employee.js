const express = require('express');
const User = require('../models/User');  // Assuming your model is located here
const router = express.Router();

// Route to fetch employee by email and their attendance details
router.get('/by-email/:empid', (req, res) => {
  const { empid } = req.params;  // Get email from URL parameter

  // Step 1: Fetch employee details using the email
  User.findByEmpId(empid, (err, results) => {
    if (err) {
      console.error('Error fetching employee:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }

    if (results.length > 0) {
      const employee = results[0];  // Assuming there's only one employee with this email

      // Step 2: Fetch the attendance details using emp_id
      User.getAttendanceByEmpId(employee.emp_no, (err, attendanceResults) => {
        if (err) {
          console.error('Error fetching attendance:', err);
          return res.status(500).json({ message: 'Error fetching attendance data', error: err.message });
        }
        console.log('Attendance Data:', attendanceResults);
        // Step 3: Return employee details and attendance records
        const response = {
          employee: {
            emp_id: employee.emp_no,
            name: employee.name,
            email: employee.email,
            position: employee.role,  // Add any other employee details you want
          },
          attendance: attendanceResults
        };

        res.json(response);  // Send back both employee and attendance data
      });

    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  });
});

module.exports = router;
