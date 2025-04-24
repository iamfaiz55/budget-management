import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { ICategory } from "../models/transaction.interface";
// import { ICategory } from "../models/ca.tegory.interface";

// Custom base query with auth
const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/category",
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

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery,
    tagTypes: ["Category"],
    endpoints: (builder) => ({
        // Get all categories
        getCategories: builder.query<{result:ICategory[], message:string}, void>({
            query: () => ({
                url: "/",
                method: "GET",
            }),
            providesTags: ["Category"],
        }),

        // Add new category
        addCategory: builder.mutation<{ message: string; category: ICategory }, Partial<ICategory>>({
            query: (newCategory) => ({
                url: "/",
                method: "POST",
                body: newCategory,
            }),
            invalidatesTags: ["Category"],
        }),

        // Update category
        updateCategory: builder.mutation<{ message: string; category: ICategory }, { id: string; name:string, type:string }>({
            query: ({ id, name, type }) => ({
                url: `/${id}`,
                method: "PUT",
                body: {name, type},
            }),
            invalidatesTags: ["Category"],
        }),

        // Delete category
        deleteCategory: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;
