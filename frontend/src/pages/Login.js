// src/pages/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://attendance-app-xtnq.onrender.com/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      // Save user data and token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else if (user.role === 'employee') {
        navigate('/employee-dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid credentials');
    }
  };

  const goToEmployeeLogin = () => {
    navigate('/employee-login');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
          <button type="submit" className="login-button">
            Login
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>

        <hr />

        <button
          onClick={goToEmployeeLogin}
          className="employee-login-button"
        >
          Go to Employee Login
        </button>
            <p className="credits">
  This app is designed by <strong>Harish G</strong>, <strong>Swaroop S Rao</strong>, and <strong>Swetha M</strong><br />
  of Thiagarajar College Of Engineering
</p>
   
      </div>

      {/* Internal CSS */}
      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #ff7e5f, #feb47b);
          padding: 20px;
        }

        .login-form {
          background: rgba(255, 255, 255, 0.9);
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 380px;
        }

        .login-form h2 {
          font-size: 2rem;
          color: #333;
          text-align: center;
          margin-bottom: 20px;
          font-family: 'Roboto', sans-serif;
        }
        .credits {
  margin-top: 25px;
  font-size: 0.85rem;
  text-align: center;
  color: #555;
  line-height: 1.4;
}

        .input-field {
          width: 100%;
          padding: 12px;
          margin: 12px 0;
          border: 2px solid #ddd;
          border-radius: 10px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .input-field:focus {
          border-color: #ff7e5f;
        }

        .login-button {
          width: 100%;
          padding: 12px;
          margin-top: 20px;
          background-color: #ff7e5f;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .login-button:hover {
          background-color: #feb47b;
        }

        .employee-login-button {
          width: 100%;
          padding: 12px;
          background-color: #ccc;
          color: #333;
          border: none;
          border-radius: 10px;
          margin-top: 15px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .employee-login-button:hover {
          background-color: #bbb;
        }

        .error-message {
          color: red;
          font-size: 0.9rem;
          margin-top: 10px;
          text-align: center;
        }

        hr {
          margin: 20px 0;
          border: none;
          border-top: 1px solid #ddd;
        }
      `}</style>
    </div>
  );
};

export default Login;
