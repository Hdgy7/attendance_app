import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { format, parseISO, isSameMonth, isSameWeek } from 'date-fns';

function AttendanceReport() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filterType, setFilterType] = useState('monthly'); // 'monthly' or 'weekly'
  const [selectedDate, setSelectedDate] = useState(''); // yyyy-MM
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get('/attendance/all');
        setAttendanceData(res.data);
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        alert('Failed to load attendance data');
      }
    };

    fetchAttendance();
  }, []);

  const handleBack = () => {
    navigate('/dashboard');
  };

  // Filtered attendance based on selectedDate & filterType
  const filteredAttendance = attendanceData.filter((row) => {
    if (!selectedDate) return true;
    const date = parseISO(row.date);
    const selected = new Date(selectedDate);

    if (filterType === 'monthly') {
      return isSameMonth(date, selected);
    } else if (filterType === 'weekly') {
      return isSameWeek(date, selected, { weekStartsOn: 1 }); // week starts on Monday
    }
    return true;
  });

  return (
    <div className="attendance-container">
      <button onClick={handleBack} className="back-button">← Back to Dashboard</button>
      <h2>Attendance Report</h2>

      {/* Filter Controls */}
      <div className="filter-controls">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
        <input
          type={filterType === 'monthly' ? 'month' : 'date'}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <h3>Filtered Employee Attendance</h3>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Date</th>
            <th>In Time</th>
            <th>Out Time</th>
            <th>Code</th>
            <th>Overtime Hours</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendance.map((row, index) => (
            <tr key={index}>
              <td>{row.emp_id}</td>
              <td>{row.name}</td>
              <td>{format(new Date(row.date), 'yyyy-MM-dd')}</td>
              <td>{row.in_time}</td>
              <td>{row.out_time}</td>
              <td>{row.code}</td>
              <td>{row.overtime_hrs}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>
        {`
          .attendance-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 30px;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            font-family: 'Arial', sans-serif;
          }

          .back-button {
            margin-bottom: 20px;
            padding: 8px 16px;
            background-color: #4e73df;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
          }

          .filter-controls {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-bottom: 20px;
          }

          .filter-controls select,
          .filter-controls input {
            padding: 8px;
            font-size: 1rem;
            border-radius: 5px;
            border: 1px solid #ccc;
          }

          h2 {
            font-size: 2rem;
            font-weight: 700;
            color: #333;
            text-align: center;
            margin-bottom: 20px;
          }

          h3 {
            font-size: 1.5rem;
            color: #4e73df;
            margin-top: 30px;
            text-align: center;
            font-weight: 600;
          }

          table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          th, td {
            padding: 12px;
            text-align: center;
            border: 1px solid #ddd;
          }

          th {
            background-color: #4e73df;
            color: white;
          }

          td {
            background-color: #fff;
            color: #333;
          }

          tbody tr:nth-child(even) {
            background-color: #f2f2f2;
          }

          tbody tr:hover {
            background-color: #f1f1f1;
            cursor: pointer;
          }

          @media (max-width: 768px) {
            .attendance-container {
              padding: 15px;
            }

            table, th, td {
              font-size: 0.9rem;
            }

            .back-button {
              font-size: 0.9rem;
              padding: 6px 12px;
            }

            .filter-controls {
              flex-direction: column;
              align-items: center;
            }
          }
        `}
      </style>
    </div>
  );
}

export default AttendanceReport;
