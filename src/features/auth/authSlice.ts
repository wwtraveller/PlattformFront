import { createSlice } from '@reduxjs/toolkit';
// импортируем типизацию данных по user из отдельного файла
import { IUserData } from './types/authType';
import { getUserWithToken, loginUser } from './authAction';

// типизация state
interface IUserState {
  user:IUserData
  isLoading: boolean
  error: string
}

// начальное значение для user
const initialUser: IUserData = {
  id: 0,
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  gender: '',
  image: '',
  token: '',
  refreshToken: '',
  role: 'admin' | 'user';
}

// создаем state и передаем начальное значение user
const initialState: IUserState = {
  user: initialUser,
  isLoading: false,
  error: '',
};

// создаем slice
export const authSlice = createSlice({
  // указываем имя slice
  name: 'authSlice',
  // передаем начальный state
  initialState,
  reducers: {
    // создаем синхронный action для очистки state
    logoutUser: (state) => {
      state.user = initialUser
    }
  },
  // ! логика работы с асинхронными действиями
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.user = initialUser
        state.error = action.payload as string
      })
      .addCase(getUserWithToken.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload;
      })
      .addCase(getUserWithToken.pending, (state, action) => {
        state.isLoading = false
        
      })
  },
});

export default authSlice;
// экспортируем синхронные actions из slice
export const { logoutUser } = authSlice.actions
