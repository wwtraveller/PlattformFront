// modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  type: null,
};


const modalWindowSlice = createSlice({
  name: 'modalWindow',
  initialState,
  reducers: {
    showModal (state, action) {
        state.isOpen = true;
        state.type = action.payload;
    },
    hideModal (state) {
        state.isOpen = false;
        state.type = null;
    },
  },
});

export const { showModal, hideModal } = modalWindowSlice.actions;
export default modalWindowSlice.reducer;
