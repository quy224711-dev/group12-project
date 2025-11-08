import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('accessToken') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { accessToken, user, refreshToken } = action.payload;
      
      state.token = accessToken;
      state.user = user;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    },

    logoutSuccess: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    
    // ✅ QUAN TRỌNG: Chỉ cập nhật token, KHÔNG xóa user
    setAccessToken: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
      localStorage.setItem('accessToken', accessToken);
      // ⚠️ KHÔNG xóa state.user ở đây!
    }
  },
});

export const { loginSuccess, logoutSuccess, setAccessToken } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export default authSlice.reducer;