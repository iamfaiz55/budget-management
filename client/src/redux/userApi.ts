import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { IUser } from "../models/user.interface";

// Custom base query to fetch token from Redux store
const baseQuery = fetchBaseQuery({
    // baseUrl: "http://localhost:5000/api/v1/user",
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const token = state.auth.token;

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

// Create API
export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery,
    endpoints: (builder) => ({
        // Fetch all users with pagination
        getAllUsers: builder.query<
            { message: string; result: IUser[]; totalPages?: number; totalUsers?: number },
            { searchQuery?: string; isFetchAll?: boolean; page?: number; limit?: number }
        >({
            query: ({ searchQuery = "", isFetchAll = false, page = 1, limit = 10 }) => ({
                url: "/all-users",
                method: "GET",
                params: {
                    searchQuery,
                    isFetchAll,
                    page,   // Pagination parameter
                    limit,  // Pagination parameter
                },
            }),
            transformResponse(data: { message: string; result: IUser[]; totalPages?: number; totalUsers?: number }) {
                return {
                    message: data.message,
                    result: data.result,
                    totalPages: data.totalPages ?? 1,  // Default to 1 if totalPages is not returned
                    totalUsers: data.totalUsers ?? data.result.length, // Default to length of result if totalUsers is not returned
                };
            },
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data.message,
        }),
    }),
});

// Export hooks
export const {
    useGetAllUsersQuery,
} = userApi;
