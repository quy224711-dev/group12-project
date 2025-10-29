// src/api.js
import axios from 'axios';

// Tạo một "instance" của axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL gốc của backend
});

// Thêm một "interceptor" để tự động thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;