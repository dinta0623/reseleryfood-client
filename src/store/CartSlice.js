import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useStorage } from "@/utility/storage";
import { useApi } from "@/utility/api";

export const name = "cart";

export const setCartPersist = createAsyncThunk(
  `${name}/setCartPersist`,
  async (payload) => {
    if (payload) {
      await useStorage(name, payload);
      return payload;
    }
    return null;
  }
);

export const resetCartPersist = createAsyncThunk(
  `${name}/resetCartPersist`,
  async () => {
    await useStorage(name, null);
    return null;
  }
);

export const CartSlice = createSlice({
  name,
  initialState: {
    mitra_id: null,
    items: null,
    checkout: null,
  },
  reducers: {
    SET_CART(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    RESET_CART(state, { payload }) {
      return {
        mitra_id: null,
        items: null,
        checkout: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setCartPersist.fulfilled, (state, action) => {
      return {
        ...state,
        ...action?.payload,
      };
    });
    builder.addCase(resetCartPersist.fulfilled, (state, action) => {
      return {
        mitra_id: null,
        items: null,
        checkout: null,
      };
    });
  },
});

export const { SET_CART, RESET_CART } = CartSlice.actions;
