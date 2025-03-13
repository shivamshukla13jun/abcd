// src/redux/sidebarSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  collapsed: false,  // Sidebar starts expanded
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.collapsed = !state.collapsed;
    },
  },
});

export const { toggleSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
