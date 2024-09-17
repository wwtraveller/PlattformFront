import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    isAuthModalOpen: false, // Управляем состоянием модального окна
  },
  reducers: {
    openAuthWindow: (state) => {
      state.isAuthModalOpen = true; // Открываем модальное окно
    },
    closeAuthWindow: (state) => {
      state.isAuthModalOpen = false; // Закрываем модальное окно
    },
  },
});

export const { openAuthWindow, closeAuthWindow } = modalSlice.actions;
export default modalSlice.reducer;
