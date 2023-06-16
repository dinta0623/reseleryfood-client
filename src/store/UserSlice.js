import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useStorage } from "@/utility/storage";
import { useApi } from "@/utility/api";

export const name = "user";

export const logoutUser = createAsyncThunk(`${name}/logoutUser`, async () => {
  await useStorage("credentials", null);
  // await useStorage("cart", null);
  return true;
});

export const UserSlice = createSlice({
  name,
  initialState: {
    isLogged: false,
  },
  reducers: {
    SET_LOGIN(state, { payload }) {
      if (payload?.access_token && payload?.refresh_token) {
        useStorage("credentials", payload);
        return {
          ...payload?.user,
          isLogged: true,
        };
      }
    },
    SET_USER(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    RESET_USER(state, { payload }) {
      return {
        isLogged: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state, { payload }) => {
      return {
        isLogged: false,
      };
    });
  },
});

export const { SET_LOGIN, SET_USER, RESET_USER } = UserSlice.actions;

// export const userState = (state) => state.counter.value
