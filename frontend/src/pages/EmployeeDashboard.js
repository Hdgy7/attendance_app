import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  parseISO,
  getMonth,
  getYear,
  format,
  startOfWeek,
  differenceInCalendarDays
} from 'date-fns';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedWeek, setSelectedWeek] = useState('all');

  const navigate = useNavigate();
  const empid = localStorage.getItem('employeeId');
  const currentYear = new Date().getFullYear();

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'yyyy-MM-dd');
  };

  useEffect(() => {
    const fetchEmployeeAndAttendance = async () => {
      if (!empid) {
        console.error('Employee ID not found in localStorage');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`https://attendance-app-xtnq.onrender.com/api/employee/by-email/${empid}`);
        setEmployee(res.data.employee);
        setAttendance(res.data.attendance || []);
      } catch (err) {
        console.error('Error fetching employee or attendance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeAndAttendance();
  }, [empid]);

  const handleLogout = () => {
    localStorage.removeItem('employeeId');
    navigate('/employee-login'); // Change this route as per your routing
  };

  const getFilteredAttendance = () => {
    return attendance.filter(record => {
      const date = parseISO(record.date);
      const recordMonth = getMonth(date);
      const recordYear = getYear(date);
      const selectedMonthInt = Number(selectedMonth);

      if (recordMonth !== selectedMonthInt || recordYear !== currentYear) return false;
      if (selectedWeek === 'all') return true;

      const weekStart = startOfWeek(new Date(currentYear, selectedMonthInt, 1), { weekStartsOn: 1 });
      const daysDiff = differenceInCalendarDays(date, weekStart);
      const recordWeek = Math.floor(daysDiff / 7) + 1;

      return recordWeek === parseInt(selectedWeek);
    });
  };

  const filteredAttendance = getFilteredAttendance();
  const totalOvertime = filteredAttendance.reduce((acc, record) => acc + parseFloat(record.overtime_hrs || 0), 0);

  if (loading) return <p>Loading...</p>;
  if (!employee) return <p>Employee not found or not logged in.</p>;

  return (
    <div className="dashboard-container">
      <div style={{ textAlign: 'right' }}>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <h2>Welcome, {employee.name}</h2>

      <div className="employee-details">
        <p><strong>Employee ID:</strong> {employee.emp_id}</p>
        <p><strong>Email:</strong> {employee.email}</p>
      </div>

      <div className="filter-controls">
        <label>
          Month:
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }).map((_, i) => (
              <option value={i} key={i}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </label>
        <label>
          Week:
          <select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)}>
            <option value="all">All</option>
            <option value="1">Week 1</option>
            <option value="2">Week 2</option>
            <option value="3">Week 3</option>
            <option value="4">Week 4</option>
            <option value="5">Week 5</option>
          </select>
        </label>
      </div>

      <div className="attendance-summary">
        <div className="summary-card">
          <h4>Total Working Days:</h4>
          <p>{filteredAttendance.length}</p>
        </div>
        <div className="summary-card">
          <h4>Total Overtime Hours:</h4>
          <p>{totalOvertime} hrs</p>
        </div>
      </div>

      <h3>Attendance Report</h3>
      {filteredAttendance.length > 0 ? (
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
            {filteredAttendance.map((record) => (
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
        <p>No attendance records found for selected filter.</p>
      )}

      <style jsx>{`
        .dashboard-container {
          font-family: 'Arial', sans-serif;
          background-color: #f4f7fa;
          padding: 30px;
          border-radius: 8px;
          max-width: 900px;
          margin: 0 auto;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        h2 {
          text-align: center;
          color: #4e73df;
        }

        .logout-button {
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 5px;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 10px;
        }

        .logout-button:hover {
          background-color: #c0392b;
        }

        .employee-details {
          text-align: center;
          margin-bottom: 20px;
        }

        .employee-details p {
          font-size: 16px;
          color: #555;
        }

        .filter-controls {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 20px;
          background-color: #ffffff;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .filter-controls label {
          font-size: 14px;
          color: #333;
          font-weight: bold;
        }

        .filter-controls select {
          font-size: 14px;
          padding: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #f7f7f7;
          width: 120px;
        }

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

        h3 {
          font-size: 22px;
          color: #333;
          margin-bottom: 10px;
        }

        p {
          font-size: 16px;
          color: #555;
        }

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

          .filter-controls {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployeeDashboard;
