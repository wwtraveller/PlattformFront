import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// импортируем типизацию данных по user из отдельного файла
import { IUserData } from "../../features/auth/types/authType";
import { getUserWithToken, loginUser } from "../../features/auth/authAction";

// типизация state
interface IUserState {
  user: IUserData;
  isLoading: boolean;
  error: string | null;
}

// начальное значение для user
const initialUser: IUserData = {
  id: 0,
  username: "",
  email: "",
  firstName: "",
  lastName: "",
  photo: "",
  accessToken: "",
  refreshToken: "",
  roles: [],
  avatar: "",
};

// создаем state и передаем начальное значение user
const initialState: IUserState = {
  user: initialUser,
  isLoading: false,
  error: null,
};

// создаем slice
export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    // создаем синхронный action для очистки state
    logoutUser: (state) => {
      state.user = initialUser;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
    },
    setUserData: (state, action: PayloadAction<IUserData>) => {
      state.user = action.payload;
    },
    setUserAvatar: (state, action: PayloadAction<string>) => {
      state.user.photo = action.payload;
  },
  updateUserProfile: (state, action: PayloadAction<Partial<IUserData>>) => {
    state.user = { ...state.user, ...action.payload };
  },
  },
  // ! логика работы с асинхронными действиями
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = initialUser;
        state.error = action.payload as string;
      })
      .addCase(getUserWithToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUserWithToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserWithToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
// экспортируем синхронные actions из slice
export const { logoutUser, setUserAvatar, updateUserProfile, setUserData} = authSlice.actions;
