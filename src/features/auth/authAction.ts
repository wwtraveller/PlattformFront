import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import { ILoginFormValues } from '../../components/login/Login';
import { IUserData } from './types/authType';
import { IRegisterFormValues } from 'components/registration/Registration';

export const loginUser = createAsyncThunk(
  'loginUser',
  // ! заместо data придут данные из формы
  async (data: ILoginFormValues, thunkAPI) => {
    try {
      // в post запрос мы можем передать данные не в строке, а в отдельной переменной
      // в данном случае в data лежать данные из формы, мы их передаем в api
      const response: AxiosResponse<IUserData> = await axios.post('https://dummyjson.com/auth/login', data);
      // здесь мы сохраняем токен во внутреннее хранилище в браузере local storage
      // данные сохраненные в нем не будут стираться при перезагрузке страницы
      localStorage.setItem("user-token", response.data.token)
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// запрос за данными юзера использующий сохраненный в браузере token
export const getUserWithToken = createAsyncThunk(
  'getUserWithToken',
  async (token: string, thunkAPI) => {
    try {
      const response: AxiosResponse<IUserData> = await axios.get('https://dummyjson.com/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Экшен для регистрации нового пользователя
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: IRegisterFormValues, thunkAPI) => {
    try {
      const response = await axios.post('/api/users', data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);