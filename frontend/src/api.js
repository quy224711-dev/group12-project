// frontend/src/api.js
import axios from 'axios';
import { store } from './redux/store'; // Import kho
import { loginSuccess, logoutSuccess } from './redux/authSlice'; // Import hành động

const API_URL = 'http://localhost:5000/api';

// Tạo một phiên bản axios tùy chỉnh
const api = axios.create({
  baseURL: API_URL,
});

// 1. Gác cổng "Gửi đi" (Tự động gắn AccessToken)
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token; // Lấy token từ kho Redux
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Gác cổng "Nhận về" (Xử lý khi AccessToken hết hạn 401)
api.interceptors.response.use(
  (response) => response, // Nếu OK (200), cho qua
  async (error) => {
    const originalRequest = error.config;
    
    // Nếu lỗi là 401 (Hết hạn) VÀ chưa thử lại
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu là đã thử lại

      try {
        // Lấy RefreshToken từ localStorage
        const refreshToken = localStorage.getItem('refreshToken'); 
        if (!refreshToken) throw new Error('No refresh token');

        // Gọi API /auth/refresh (dùng axios GỐC)
        const rs = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: refreshToken,
        });

        const { accessToken } = rs.data;

        // Cập nhật kho Redux với token mới
        store.dispatch(loginSuccess({ accessToken: accessToken }));

        // Gắn token mới vào header của yêu cầu GỐC
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        
        // THỬ LẠI yêu cầu gốc (ví dụ /profile)
        return api(originalRequest);

      } catch (_error) {
        // Nếu RefreshToken cũng hết hạn
        store.dispatch(logoutSuccess()); // Đăng xuất người dùng
        window.location.href = '/login'; // Đá về trang login
        return Promise.reject(_error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;