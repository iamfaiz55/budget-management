import { createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { ICategory } from "../models/transaction.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { ICategory } from "../models/ca.tegory.interface";
console.log("----");

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
        // baseUrl: "http://192.168.54.208:5000/api/v1/subscriptions",
        baseUrl: `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/category`,
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

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery,
    // tagTypes: ["Category"],
    endpoints: (builder) => ({
        // Get all categories
        getCategories: builder.query<{result:ICategory[], message:string}, void>({
            query: () => ({
                url: "/",
                method: "GET",
            }),
            // providesTags: ["Category"],
        }),

        // Add new category
        addCategory: builder.mutation<{ message: string; category: ICategory }, Partial<ICategory>>({
            query: (newCategory) => ({
                url: "/",
                method: "POST",
                body: newCategory,
            }),
            // invalidatesTags: ["Category"],
        }),

        // Update category
        updateCategory: builder.mutation<{ message: string; category: ICategory }, { id: string; name:string, type:string }>({
            query: ({ id, name, type }) => ({
                url: `/${id}`,
                method: "PUT",
                body: {name, type},
            }),
            // invalidatesTags: ["Category"],
        }),

        // Delete category
        deleteCategory: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            // invalidatesTags: ["Category"],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;