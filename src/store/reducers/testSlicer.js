import { createSlice } from "@reduxjs/toolkit";

export const testSlicer = createSlice({
  name: "user",
  initialState: {
    isLogged: false,
  },
  reducers: {
    SET_USER(state, payload) {
      console.log(payload);
      state = {
        ...state,
        isLogged: true,
      };
    },
  },
});

export const { SET_USER } = testSlicer.actions;

// export const userState = (state) => state.counter.value
