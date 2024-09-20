import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import { ILoginFormValues } from '../../components/login/Login';
import { IUserData } from './types/authType';
import { IRegisterFormValues } from 'components/registration/Registration';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  // ! заместо data придут данные из формы
  async (data: ILoginFormValues, thunkAPI) => {
    try {
      // в post запрос мы можем передать данные не в строке, а в отдельной переменной
      // в данном случае в data лежать данные из формы, мы их передаем в api
      const response: AxiosResponse<IUserData> = await axios.post('/api/login', data);
      // здесь мы сохраняем токен во внутреннее хранилище в браузере local storage
      // данные сохраненные в нем не будут стираться при перезагрузке страницы
      localStorage.setItem("accessToken", response.data.accessToken)
      console.log(localStorage.getItem("accessToken"));
      thunkAPI.dispatch(getUserWithToken(response.data.accessToken));
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// запрос за данными юзера использующий сохраненный в браузере token
export const getUserWithToken = createAsyncThunk(
  'auth/getUserWithToken',
  async (accessToken: string, thunkAPI) => {
    try {
      const response: AxiosResponse<IUserData> = await axios.get('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
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
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);