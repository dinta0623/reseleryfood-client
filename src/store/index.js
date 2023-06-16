import { configureStore } from "@reduxjs/toolkit";
import { UserSlice } from "./UserSlice";
import { MitraSlice } from "./MitraSlice";
import { CartSlice } from "./CartSlice";

//compare with combine reducers, this does it automatically.
export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    user: UserSlice.reducer,
    mitra: MitraSlice.reducer,
    cart: CartSlice.reducer,
  },
});
