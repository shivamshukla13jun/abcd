// src/redux/Slice/toastSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toast: null, // Store a single toast object
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action) => {
      state.toast = { id: Date.now(), message: action.payload.message, type: action.payload.type };
    },
    removeToast: (state) => {
      state.toast = null;
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;

export default toastSlice.reducer;
