import { createApi,  fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ITransaction } from "../models/transaction.interface";
import { RootState } from "./store";

// Custom base query to fetch token from Redux store
const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/transaction",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const token = state?.auth?.token; 

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

// Create API
export const transactionApi = createApi({
    reducerPath: "transactionApi",
    baseQuery,
    endpoints: (builder) => ({
        getAllTransactions: builder.query<{ message: string; result: ITransaction[] , balance:number}, void>({
            query: () => ({
                url: "/get-transactions",
                method: "GET",
            }),

            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),

        transactionByDate: builder.query<{ message: string; result: ITransaction[] }, { fromDate: string; toDate: string }>({
            query: (dates) => ({
                url: "/transaction-by-date",
                method: "POST",
                body: dates,
            }),
            transformResponse(data: { message: string; result: ITransaction[] }) {
                return { message: data.message, result: data.result };
            },
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),

        addTransaction: builder.mutation<void, ITransaction>({
            query: (data) => ({
                url: "/add-transaction",
                method: "POST",
                body: data,
            }),
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),
        addAmountToMember: builder.mutation<void,{memberId:string, amount:number, account:string, date:string}>({
            query: (data) => ({
                url: "/add-amount-to-member",
                method: "POST",
                body: data
            }),
          
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),
    }),
});

// Export Hooks
export const {
    useGetAllTransactionsQuery,
    useAddTransactionMutation,
    useLazyTransactionByDateQuery,
    useAddAmountToMemberMutation
} = transactionApi;
