import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // For password visibility toggle

const EmployeeLogin = ({ setUser }) => {
  const [empid, setEmpid] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/employee-login', {
        empid,
        password,
      });

      if (res.data.token) {
        localStorage.setItem('employeeId',empid); // Store empid in localStorage
        setUser(res.data.user);
        const emp_id = localStorage.getItem('employeeId');
        console.log(emp_id);
        navigate('/employee-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Employee Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Employee ID"
              value={empid}
              onChange={(e) => setEmpid(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>

      {/* Internal CSS styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), 
                      url('https://images.unsplash.com/photo-1518709268805-4e9042af592c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          animation: fadeIn 1s ease-in-out;
        }

        .login-form {
          background: rgba(255, 255, 255, 0.1);
          padding: 40px;
          border-radius: 20px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: slideUp 0.8s ease-out;
        }

        .login-form h2 {
          color: #ffffff;
          text-align: center;
          font-size: 2.2rem;
          font-weight: 600;
          margin-bottom: 30px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .form-group {
          margin-bottom: 25px;
          position: relative;
        }

        .form-group input {
          width: 100%;
          padding: 14px 20px;
          border-radius: 12px;
          border: none;
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .form-group input:focus {
          background: rgba(255, 255, 255, 0.25);
          box-shadow: 0 0 10px rgba(37, 117, 252, 0.5);
        }

        .password-group {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #ffffff;
          cursor: pointer;
          font-size: 1.2rem;
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }

        .password-toggle:hover {
          opacity: 1;
        }

        .login-button {
          width: 100%;
          padding: 15px;
          background: linear-gradient(45deg, #2575fc, #6a11cb);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 1.2rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .login-button:hover {
          background: linear-gradient(45deg, #1a63d3, #5a0fb3);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(37, 117, 252, 0.4);
        }

        .login-button:active {
          transform: translateY(0);
        }

        .login-button:disabled {
          background: #666;
          cursor: not-allowed;
        }

        .error-message {
          color: #ff4d4d;
          background: rgba(255, 75, 75, 0.2);
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
          font-size: 0.9rem;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .login-form {
            padding: 30px;
            max-width: 90%;
          }

          .login-form h2 {
            font-size: 1.8rem;
          }

          .form-group input {
            padding: 12px 15px;
            font-size: 0.9rem;
          }

          .login-button {
            padding: 12px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployeeLogin;