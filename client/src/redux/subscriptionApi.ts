import { createApi,  fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { IMyPlan, IPayment, IPaymentCreate, ISubscription } from "../models/subscription.interface";
// import { IPlan } from "../models/plan.interface";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/subscriptions",
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
                return { message: data.message, result: data.result };
            },
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),
        getAllPremiumMembers: builder.query< any , void>({
            query: () => ({
                url: "/get-all-premium-members",
                method: "GET",
            }),
            transformResponse(data: any) {
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
 useAddPersonMutation,
 useGetAllPremiumMembersQuery
} = subscriptionApi;
