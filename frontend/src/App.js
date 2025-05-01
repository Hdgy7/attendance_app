import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Admin dashboard
import Empolyeedashboard from './pages/EmployeeDashboard'; // Employee dashboard
import AddUser from './pages/AddUser';
import AttendanceReport from './pages/AttendanceReport';
import ManageEmployee from './pages/ManageEmployee';
import EmployeeLogin from './pages/EmployeeLogin';
import AttendanceEntry from './pages/AttendanceEntry'; // Import AttendanceEntry component

import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Home Route: login page or redirect based on user role */}
        <Route
          path="/"
          element={
            !user ? (
              <Login setUser={setUser} />
            ) : user.role === 'admin' ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/employee-dashboard" />
            )
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/dashboard"
          element={
            user && user.role === 'admin' ? <Dashboard setUser={setUser} /> : <Navigate to="/" />
          }
        />

        {/* Employee dashboard */}
        <Route
          path="/employee-dashboard"
          element={
            user && user.role === 'employee' ? (
              <Empolyeedashboard user={user} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Employee login route */}
        <Route
          path="/employee-login"
          element={<EmployeeLogin setUser={setUser} />}
        />
        <Route
          path="/attendance-entry"
          element={<AttendanceEntry />}  // Add this line for the attendance entry page
        />

        {/* Other admin pages */}
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/attendance-report" element={<AttendanceReport />} />
        <Route path="/manage-employee" element={<ManageEmployee />} />
      </Routes>
    </Router>
  );
}

export default App;
