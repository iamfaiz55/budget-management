import { createApi,  FetchArgs,  fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { ITransaction } from "../models/transaction.interface";
import { IPlan } from "../models/plan.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getToken = async () => {
    try {
        return await AsyncStorage.getItem("authToken");
    } catch (error) {
        console.error("Error fetching token from AsyncStorage", error);
        return null;
    }
};



// Custom base query to fetch token from Redux store
const baseQuery = async (args: string | FetchArgs, api: any, extraOptions: any) => {
    const token = await getToken();

    const baseQueryFn = fetchBaseQuery({
        // baseUrl: "http://192.168.54.208:5000/api/v1/subscriptions",
        baseUrl: `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/subscriptions`,
        credentials: "include",
        prepareHeaders: (headers) => {
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    });

    const response = await baseQueryFn(args, api, extraOptions);

    // Handle session expiration
    if (response.error?.status === 401) {
        const errorData = response.error.data as { message?: string };
        if (errorData?.message === "Session has expired. Please log in again.") {
            await AsyncStorage.removeItem("authToken");
        }
    }

    return response;
};

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
