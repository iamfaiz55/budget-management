import { createApi,  FetchArgs,  fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
// import { IMyPlan, IPayment, IPaymentCreate, ISubscription } from "../models/subscription.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IMyPlan, IPayment, IPaymentCreate, ISubscription } from "@/models/subscription.interface";
// import { IPlan } from "../models/plan.interface";
// Fetch token from AsyncStorage
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

export const subscriptionApi = createApi({
    reducerPath: "subscriptionApi",
    baseQuery,
    endpoints: (builder) => ({
        getAllPremiumUsers: builder.query<{ message: string; result: ISubscription[] }, void>({
            query: () => ({
                url: "/plans",
                method: "GET",
            }),
            transformResponse(data: { message: string; result: ISubscription[] }) {
                return { message: data.message, result: data.result };
            },
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),
        getMyPlan: builder.query< IMyPlan , void>({
            query: () => ({
                url: "/my-plan",
                method: "GET",
            }),
            transformResponse(data: IMyPlan) {
                // console.log("data: IMyPlan", data);
                
                return { message: data.message, result: data.result };
            },
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),

        createSubscribeOrder: builder.mutation<{message:string, result:IPaymentCreate},{planId:string}>({
            query: (planId) => ({
                url: "/create-order",
                method: "POST",
                body: planId,
            }),
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),
        buyFreePlan: builder.mutation<{message:string, result:IPaymentCreate},{planId:string}>({
            query: (planId) => ({
                url: "/buy-free-plan",
                method: "POST",
                body: planId,
            }),
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),
        addPerson: builder.mutation<{message:string},{personId:string}>({
            query: (personId) => ({
                url: "/add-person",
                method: "POST",
                body: personId,
            }),
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),
        verifyPayment: builder.mutation<void,IPayment>({
            query: (planId) => ({
                url: "/verify-payment",
                method: "POST",
                body: planId,
            }),
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),
        updatePlan: builder.mutation<void, ISubscription>({
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
 useCreateSubscribeOrderMutation,
 useVerifyPaymentMutation,
 useGetMyPlanQuery,
 useBuyFreePlanMutation,
 useAddPersonMutation
} = subscriptionApi;
