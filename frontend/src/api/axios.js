import axios from 'axios';

// Create a base axios instance with your API base URL
const instance = axios.create({
  baseURL: 'https://attendance-app-xtnq.onrender.com/', // Your backend URL
  withCredentials: true, // Make sure credentials (cookies) are sent along with requests
});

// Add a request interceptor to add the Authorization header with JWT token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get the token from localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Attach the token to request headers
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
