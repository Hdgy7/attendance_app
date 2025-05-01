import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalOvertime, setTotalOvertime] = useState(0);  // For total overtime hours in the month

  // Get empid from localStorage
  const empid = localStorage.getItem('employeeId');
  console.log(empid);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];  // Returns date in YYYY-MM-DD format
  };

  useEffect(() => {
    const fetchEmployeeAndAttendance = async () => {
      if (!empid) {
        console.error('Employee ID not found in localStorage');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/employee/by-email/${empid}`);
        const employeeData = res.data.employee;
        setEmployee(employeeData);

        // Set attendance from the response
        setAttendance(res.data.attendance || []);

        // Calculate total overtime hours
        const overtimeHours = res.data.attendance.reduce((acc, record) => acc + parseFloat(record.overtime_hrs || 0), 0);
        setTotalOvertime(overtimeHours);
      } catch (err) {
        console.error('Error fetching employee or attendance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeAndAttendance();
  }, [empid]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!employee) {
    return <p>Employee not found or not logged in.</p>;
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome, {employee.name}</h2>
      <div className="employee-details">
        <p><strong>Employee ID:</strong> {employee.emp_id}</p>
        <p><strong>Email:</strong> {employee.email}</p>
      </div>

      <div className="attendance-summary">
        <h3>Attendance Summary for the Current Month</h3>
        <div className="summary-card">
          <h4>Total Working Days:</h4>
          <p>{attendance.length}</p>
        </div>
        <div className="summary-card">
          <h4>Total Overtime Hours This Month:</h4>
          <p>{totalOvertime} hrs</p>
        </div>
      </div>

      <h3>Attendance Report</h3>
      {attendance && attendance.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Code</th>
              <th>Overtime Hours</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record.id}>
                <td>{formatDate(record.date)}</td>
                <td>{record.in_time}</td>
                <td>{record.out_time}</td>
                <td>{record.code || '-'}</td>
                <td>{record.overtime_hrs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendance records found.</p>
      )}
      
      {/* Internal CSS with Media Queries for mobile responsiveness */}
      <style jsx>{`
        /* Dashboard container */
        .dashboard-container {
          font-family: 'Arial', sans-serif;
          background-color: #f4f7fa;
          padding: 30px;
          border-radius: 8px;
          max-width: 900px;
          margin: 0 auto;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Header styling */
        h2 {
          text-align: center;
          color: #4e73df;
        }

        .employee-details {
          text-align: center;
          margin-bottom: 20px;
        }

        .employee-details p {
          font-size: 16px;
          color: #555;
        }

        /* Summary section */
        .attendance-summary {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }

        .summary-card {
          background-color: #fff;
          border-radius: 8px;
          padding: 20px;
          width: 48%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .summary-card h4 {
          font-size: 18px;
          color: #333;
          margin-bottom: 10px;
        }

        .summary-card p {
          font-size: 24px;
          color: #4e73df;
          font-weight: bold;
        }

        /* Attendance table */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th, td {
          padding: 10px;
          text-align: center;
          border: 1px solid #ddd;
        }

        th {
          background-color: #4e73df;
          color: white;
        }

        tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        tr:hover {
          background-color: #e2e2e2;
        }

        td {
          color: #555;
        }

        /* General styling */
        h3 {
          font-size: 22px;
          color: #333;
          margin-bottom: 10px;
        }

        p {
          font-size: 16px;
          color: #555;
        }

        /* upps */
        @media (max-width: 768px) {
          .attendance-summary {
            flex-direction: column;
            align-items: center;
          }

          .summary-card {
            width: 90%;
            margin-bottom: 20px;
          }

          table {
            font-size: 14px;
            margin-top: 15px;
          }

          th, td {
            padding: 8px;
          }

          h3 {
            font-size: 20px;
          }

          .employee-details p {
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .dashboard-container {
            padding: 15px;
          }

          h2 {
            font-size: 24px;
          }

          .summary-card h4 {
            font-size: 16px;
          }

          .summary-card p {
            font-size: 18px;
          }

          table {
            font-size: 12px;
          }

          .employee-details p {
            font-size: 12px;
          }

          h3 {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployeeDashboard;