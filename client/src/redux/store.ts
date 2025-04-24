import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import authSlice from "./slices/authSlice";
import { transactionApi } from "./transactionApi";
import { planApi } from "./planApi";
import { subscriptionApi } from "./subscriptionApi";
import { userApi } from "./userApi";
import { categoryApi } from "./categoryApi";





const reduxStore = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [planApi.reducerPath]: planApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
auth :    authSlice

  
  },
  middleware: (getDefaultMiddleware:any) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      transactionApi.middleware,
      planApi.middleware,
      subscriptionApi.middleware,
      userApi.middleware,
      categoryApi.middleware,
  
    )
})


export type RootState = ReturnType<typeof reduxStore.getState>
export type AppDispatch = typeof reduxStore.dispatch

export default reduxStore

