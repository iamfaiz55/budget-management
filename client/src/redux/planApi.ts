import { createApi,  fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { ITransaction } from "../models/transaction.interface";
import { RootState } from "./store";
import { IPlan } from "../models/plan.interface";

// Custom base query to fetch token from Redux store
const baseQuery = fetchBaseQuery({
    // baseUrl: "http://localhost:5000/api/v1/subscriptions",
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions`,
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
export const planApi = createApi({
    reducerPath: "planApi",
    baseQuery,
    endpoints: (builder) => ({
        getAllPlans: builder.query<{ message: string; result: IPlan[] }, void>({
            query: () => ({
                url: "/plans",
                method: "GET",
            }),
            transformResponse(data: { message: string; result: IPlan[] }) {
                return { message: data.message, result: data.result };
            },
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),

        addPlan: builder.mutation<void, IPlan>({
            query: (data) => ({
                url: "/add-plan",
                method: "POST",
                body: data,
            }),
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),
        updatePlan: builder.mutation<void, IPlan>({
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
   useGetAllPlansQuery,
   useAddPlanMutation,
   useUpdatePlanMutation
} = planApi;
