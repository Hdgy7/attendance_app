import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function AddUser() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate(); // For navigation

  const handleUpload = async () => {
    if (!file) return alert('Please select a file.');
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('✅ Attendance uploaded successfully.');
    } catch (err) {
      alert('❌ Upload failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleBack = () => {
    navigate('/dashboard'); // Navigate to Dashboard
  };

  return (
    <div className="upload-container">
      <button onClick={handleBack} className="back-button">← Back to Dashboard</button>

      <div className="upload-form">
        <h2>Upload Attendance Sheet</h2>
        <p>Choose your Excel file to upload the attendance records.</p>
        
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input"
        />
        
        <button onClick={handleUpload} className="upload-button">
          Upload
        </button>
      </div>

      <style>
        {`
          .upload-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            text-align: center;
            font-family: 'Arial', sans-serif;
          }

          .back-button {
            background-color: #4e73df;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 30px;
            font-size: 1rem;
            transition: background-color 0.3s;
          }

          .back-button:hover {
            background-color: #2e59d9;
          }

          .upload-form {
            background-color: #f8f9fc;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            margin-top: 20px;
          }

          h2 {
            color: #333;
            font-size: 2rem;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          p {
            color: #555;
            font-size: 1.1rem;
            margin-bottom: 20px;
          }

          .file-input {
            display: block;
            margin: 20px auto;
            padding: 10px;
            font-size: 1rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            width: 80%;
            background-color: #f9f9f9;
            color: #333;
          }

          .file-input:focus {
            outline: none;
            border-color: #4e73df;
          }

          .upload-button {
            padding: 12px 30px;
            background-color: #4e73df;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1.2rem;
            transition: background-color 0.3s;
            width: 100%;
          }

          .upload-button:hover {
            background-color: #2e59d9;
          }
        `}
      </style>
    </div>
  );
}

export default AddUser;
