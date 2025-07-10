import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { token: null, level: null, topic: null },
  reducers: {
    setToken: (state, action) => { state.token = action.payload },
    setDiagnostic: (state, action) => {
      state.level = action.payload.level;
      state.topic = action.payload.topic;
    },
    logout: (state) => {
      state.token = null;
      state.level = null;
      state.topic = null;
    }
  }
});

export const { setToken, setDiagnostic, logout } = userSlice.actions;
export default userSlice.reducer;