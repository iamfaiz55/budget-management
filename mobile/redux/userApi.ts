import { createApi,  FetchArgs,  fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { IUser } from "../models/user.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getToken = async () => {
    try {
        return await AsyncStorage.getItem("authToken");
    } catch (error) {
        console.error("Error fetching token from AsyncStorage", error);
        return null;
    }
};



const baseQuery = async (args: string | FetchArgs, api: any, extraOptions: any) => {
    const token = await getToken();

    const baseQueryFn = fetchBaseQuery({
        baseUrl:`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/user`,
        credentials: "include",
        prepareHeaders: (headers) => {
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    });

    const response = await baseQueryFn(args, api, extraOptions);

    if (response.error?.status === 401) {
        const errorData = response.error.data as { message?: string };
        if (errorData?.message === "Session has expired. Please log in again.") {
            await AsyncStorage.removeItem("authToken");
        }
    }

    return response;
};
export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery,
    endpoints: (builder) => ({
        getAllUsers: builder.query<
        { message: string; result: IUser[] },
        { searchQuery?: string; isFetchAll?: boolean }
      >({
        query: ({ searchQuery = "", isFetchAll = true }) => ({
          url: "/all-users",
          method: "GET",
          params: {
            searchQuery,
            isFetchAll,
          },
        }),
        transformResponse(data: { message: string; result: IUser[] }) {
          return { message: data.message, result: data.result };
        },
        transformErrorResponse: (error: { status: number; data: { message: string } }) =>
          error.data.message,
      }),
      
        
        addPlan: builder.mutation<void, IUser>({
            query: (data) => ({
                url: "/add-plan",
                method: "POST",
                body: data,
            }),
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),
        updatePlan: builder.mutation<void, IUser>({
            query: (data) => ({
                url: `/update-plan/${data._id}`,
                method: "PUT",
                body: data,
            }),
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),
    }),
});

// Export Hooks
export const {
useGetAllUsersQuery   
} = userApi;
