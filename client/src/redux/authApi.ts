import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { RootState } from "../store"; // Import RootState to get the token from Redux
// import { IUser } from "@/models/user.interface";
import { RootState } from "./store";
import { IUser } from "../models/user.interface";

// Custom base query that retrieves the token from Redux
const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/auth",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth?.token; 
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

// Create API service
export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
    endpoints: (builder) => ({
        signIn: builder.mutation<{ message: string; result: IUser }, { email: string; password: string }>({
            query: (userData) => ({
                url: "/sign-in",
                method: "POST",
                body: userData,
            }),
        }),

        signOut: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "/sign-out",
                method: "POST",
            }),
        }),


        register: builder.mutation<{ message: string }, any>({
            query: (userData) => ({
                url: "/register",
                method: "POST",
                body: userData,
            }),
        }),

        forgotPassword: builder.mutation<{ message: string }, string>({
            query: (email) => ({
                url: "/forgot-password",
                method: "POST",
                body: { email },
            }),
        }),

        resetPassword: builder.mutation<{ message: string }, { password: string; confirmPassword: string; token: string }>({
            query: (passwordData) => ({
                url: "/reset-password",
                method: "PUT",
                body: passwordData,
            }),
        }),
    }),
});

// Export Hooks
export const {
    useSignInMutation,
    useSignOutMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useRegisterMutation,
} = authApi;
