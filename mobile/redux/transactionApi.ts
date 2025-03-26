import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "@/models/user.interface";
import { ITransaction } from "@/models/transaction.interface";

// Fetch token from AsyncStorage
const getToken = async () => {
    try {
        return await AsyncStorage.getItem("authToken");
    } catch (error) {
        console.error("Error fetching token from AsyncStorage", error);
        return null;
    }
};

// Custom base query to handle token dynamically
const baseQuery = async (args: string | FetchArgs, api: any, extraOptions: any) => {
    const token = await getToken();

    const baseQueryFn = fetchBaseQuery({
        baseUrl: "http://192.168.1.115:5000/api/v1/transaction",
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
export const transactionApi = createApi({
    reducerPath: "transactionApi",
    baseQuery,
    endpoints: (builder) => ({
        getAllTransactions: builder.query<{ message: string; result: ITransaction[] }, void>({
            query: () => ({
                url: "/get-transactions",
                method: "GET",
            }),
            transformResponse(data: { message: string; result: ITransaction[] }) {
                return { message: data.message, result: data.result };
            },
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),
        transactionByDate: builder.query<
        { message: string; result: ITransaction[] }, 
        { fromDate: string; toDate: string }>({
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
                body:data
            }),
          
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),

       
    }),
});

// Export Hooks
export const {
useGetAllTransactionsQuery,
useAddTransactionMutation,
useLazyTransactionByDateQuery
} = transactionApi;
