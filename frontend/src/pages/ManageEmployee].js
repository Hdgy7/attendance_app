import React, { useState } from 'react';
import axios from '../api/axios';

function ManageEmployee() {
  const [empId, setEmpId] = useState('');
  const [data, setData] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/attendance/employee/${empId}`);
      setData(res.data);
    } catch (err) {
      alert('Employee not found or server error');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Manage Employee Attendance</h2>
      <input
        placeholder="Enter Employee ID"
        value={empId}
        onChange={e => setEmpId(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <table border="1" cellPadding="5" style={{ marginTop: '20px' }}>
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
              <td>{row.date}</td>
              <td>{row.in_time}</td>
              <td>{row.out_time}</td>
              <td>{row.code}</td>
              <td>{row.overtime_hrs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageEmployee;
