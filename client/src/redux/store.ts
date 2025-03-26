import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import authSlice from "./slices/authSlice";
import { transactionApi } from "./transactionApi";





const reduxStore = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
auth :    authSlice

  
  },
  middleware: (getDefaultMiddleware:any) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      transactionApi.middleware,
  
    )
})


export type RootState = ReturnType<typeof reduxStore.getState>
export type AppDispatch = typeof reduxStore.dispatch

export default reduxStore

