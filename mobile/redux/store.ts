import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { transactionApi } from "./transactionApi";
import { userApi } from "./userApi";
import { subscriptionApi } from "./subscriptionApi";
import { planApi } from "./planApi";
import { categoryApi } from "./categoryApi";
// import { categoryApi } from "./categoryAPi";
// import { categoryApi } from "./categoryAPi";





const reduxStore = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [planApi.reducerPath]: planApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,


  
  },
  middleware: (getDefaultMiddleware:any) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      transactionApi.middleware,
      userApi.middleware,
      categoryApi.middleware,
      subscriptionApi.middleware,
      planApi.middleware,
  
    )
})


export type RootState = ReturnType<typeof reduxStore.getState>
export type AppDispatch = typeof reduxStore.dispatch

export default reduxStore

