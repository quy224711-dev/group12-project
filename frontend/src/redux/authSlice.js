// src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

// Tự động lấy token từ localStorage khi tải lại trang
const token = localStorage.getItem('accessToken');
const initialState = {
  token: token,
  user: token ? jwtDecode(token) : null, // Tự giải mã token
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Hành động: Cất accessToken vào kho (state) VÀ localStorage
    loginSuccess: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
      localStorage.setItem('accessToken', accessToken);
      state.user = jwtDecode(accessToken); 
    },
    // Hành động: Dọn kho (state) VÀ localStorage
    logoutSuccess: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken'); // Xóa cả 2
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;

// Hàm selector: Giúp component lấy dữ liệu từ kho
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentUser = (state) => state.auth.user;