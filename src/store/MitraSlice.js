import { createSlice } from "@reduxjs/toolkit";
import { useStorage } from "@/utility/storage";
import { useApi } from "@/utility/api";

export const name = "mitra";

export const MitraSlice = createSlice({
  name,
  initialState: {},
  reducers: {
    SET_MITRA(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    RESET_MITRA(state, { payload }) {
      return {};
    },
  },
});

export const { SET_MITRA, RESET_MITRA } = MitraSlice.actions;
