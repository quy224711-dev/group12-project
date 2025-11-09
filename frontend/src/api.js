import axios from 'axios';
import { store } from './redux/store';
import { setAccessToken, logoutSuccess } from './redux/authSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Gắn token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Tự động refresh khi 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: refreshToken,
        });

        const { accessToken } = response.data;
        store.dispatch(setAccessToken({ accessToken }));

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        store.dispatch(logoutSuccess());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;