import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the user state
    setUser(null);
    // Navigate to the home page (localhost:3000 or /)
    navigate('/');
  };

  return (
    <div className="dashboard">
      <h2>Welcome, Admin</h2>
      <div className="card-container">
        <div className="card" onClick={() => navigate('/add-user')}>Attendance Upload</div>
        <div className="card" onClick={() => navigate('/attendance-report')}>Attendance Report</div>
        <div className="card" onClick={() => navigate('/manage-employee')}>Manage Employee</div>
      </div>

      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
}

export default Dashboard;
