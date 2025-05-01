// src/pages/AttendanceEntry.js
import React, { useState } from 'react';
import axios from '../api/axios';

function AttendanceEntry() {
  const [empId, setEmpId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!empId) {
      setMessage('Please enter your Employee ID');
      return;
    }

    try {
      const res = await axios.post('/attendanceController/att-log', { emp_id: empId });
      setMessage(res.data.message); // Display success message from backend
      setEmpId(''); // Clear the input field after successful request
    } catch (err) {
      console.error('Error recording attendance:', err);
      setMessage('Failed to record attendance');
    }
  };

  return (
    <div className="attendance-container">
      <h2 className="heading">Enter Attendance</h2>
      <form onSubmit={handleSubmit} className="attendance-form">
        <input
          type="text"
          placeholder="Employee ID"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
          required
          className="emp-input"
        />
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
      {message && <p className="message">{message}</p>}
      
      <style>{`
        .attendance-container {
          background-color: #f4f4f9;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          padding: 20px;
        }

        .heading {
          font-size: 2.5rem;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 20px;
          text-align: center;
        }

        .attendance-form {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .emp-input {
          padding: 12px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          outline: none;
          transition: all 0.3s ease;
        }

        .emp-input:focus {
          border-color: #3498db;
          box-shadow: 0px 0px 5px rgba(52, 152, 219, 0.5);
        }

        .submit-btn {
          padding: 12px;
          font-size: 18px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-btn:hover {
          background-color: #45a049;
        }

        .message {
          font-size: 16px;
          color: #4CAF50;
          font-weight: bold;
          margin-top: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default AttendanceEntry;
