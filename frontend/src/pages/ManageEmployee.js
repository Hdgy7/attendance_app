import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { format } from 'date-fns'; // Import format from date-fns

function ManageEmployee() {
  const [empId, setEmpId] = useState('');
  const [data, setData] = useState([]);
  const navigate = useNavigate(); // For navigation

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/attendance/employee/${empId}`);
      setData(res.data);
    } catch (err) {
      alert('Employee not found or server error');
    }
  };

  const handleBack = () => {
    navigate('/dashboard'); // Navigate to Dashboard.js
  };

  return (
    <div className="manage-employee-container">
      <button onClick={handleBack} className="back-button">← Back to Dashboard</button>
      
      <h2>Manage Employee Attendance</h2>
      <div className="search-container">
        <input
          placeholder="Enter Employee ID"
          value={empId}
          onChange={e => setEmpId(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {data.length > 0 && (
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Code</th>
              <th>Overtime</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td>{format(new Date(row.date), 'yyyy-MM-dd')}</td> {/* Format the date here */}
                <td>{row.in_time}</td>
                <td>{row.out_time}</td>
                <td>{row.code}</td>
                <td>{row.overtime_hrs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {data.length === 0 && empId !== '' && (
        <p>No attendance records found for this employee.</p>
      )}

      <style>
        {`
          .manage-employee-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            font-family: 'Arial', sans-serif;
          }

          h2 {
            text-align: center;
            font-size: 1.8rem;
            color: #333;
            margin-bottom: 20px;
            text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
          }

          .search-container {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
          }

          .search-input {
            padding: 10px;
            font-size: 1rem;
            width: 250px;
            margin-right: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .search-button {
            padding: 10px 15px;
            font-size: 1rem;
            background-color: #4e73df;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .search-button:hover {
            background-color: #2e59d9;
          }

          .attendance-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            border: 1px solid #ddd;
          }

          .attendance-table th, .attendance-table td {
            padding: 12px;
            text-align: center;
            border: 1px solid #ddd;
          }

          .attendance-table th {
            background-color: #4e73df;
            color: white;
          }

          .attendance-table tr:nth-child(even) {
            background-color: #f9f9f9;
          }

          .attendance-table tr:hover {
            background-color: #f1f1f1;
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

          .back-button:hover {
            background-color: #2e59d9;
          }
        `}
      </style>
    </div>
  );
}

export default ManageEmployee;
