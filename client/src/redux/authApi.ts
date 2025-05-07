import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { RootState } from "../store"; // Import RootState to get the token from Redux
// import { IUser } from "@/models/user.interface";
import { RootState } from "./store";
import { IUser } from "../models/user.interface";

const baseQuery = fetchBaseQuery({
    // baseUrl: "http://localhost:5000/api/v1/auth",
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth?.token || ""; 
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});
//  .post("/send-otp-register", authController.requestRegistrationOTP)
//     .post("/verify-register", authController.verifyRegistrationOTP)
//     .post("/register", authController.registerUser)
// Create API service
export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
    endpoints: (builder) => ({
        signIn: builder.mutation<{ message: string; result:{otp:string}}, {username:string }>({
            query: (userData) => ({
                url: "/send-otp",
                method: "POST",
                body: userData,
            }),
            transformResponse(data: { message: string; result: { otp: string } }) {
                localStorage.setItem("loginOtp", JSON.stringify(data.result.otp));
                return data; // ✅ Ensure the response is returned
            },
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),

        signOut: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "/sign-out",
                method: "POST",
            }),
        }),


        sendOtpRegister: builder.mutation<{ message: string; result: { otp: string , mobile:number} }, {  mobile: number }>({
            query: (userData) => ({
                url: "/send-otp-register",
                method: "POST",
                body: userData,
            }),
            transformResponse(data: { message: string; result: { otp: string , mobile:number} }) {
          
                
                return data; // ✅ Ensure the response is returned
            },
        }),
        verifyRegister: builder.mutation<{ message: string; result:  IUser  }, { otp: string; mobile: number }>({
            query: (userData) => ({
                url: "/verify-register",
                method: "POST",
                body: userData,
            }),
            transformResponse(data: { message: string; result: IUser }) {
          
                
                return data; 
            },
        }),
        
        register: builder.mutation<{ message: string; result: IUser }, { name: string; mobile: number }>({
            query: (userData) => ({
                url: "/register",
                method: "POST",
                body: userData,
            }),
            transformResponse(data: { message: string; result: IUser }) {
          
                
                return data; // ✅ Ensure the response is returned
            },
        }),

        verifyOtp: builder.mutation<{ message: string, result: IUser  }, {username:string, otp:string}>({
            query: (otp) => ({
                url: "/verify-otp",
                method: "POST",
                body: otp ,
            }),
        }),
         googleLogin: builder.mutation<{ message: string; result:  IUser  }, { idToken:string }>({
                    query: (userData) => ({
                        url: "/google-login",
                        method: "POST",
                        body: userData, 
                    }),
                    transformResponse: (data: { message: string, result: IUser  }) => data,
                }),

        
    }),
});

// Export Hooks
export const {
    useSignInMutation,
    useSignOutMutation,
    useRegisterMutation,
    useVerifyOtpMutation,
    useSendOtpRegisterMutation,
    useVerifyRegisterMutation,
    useGoogleLoginMutation
} = authApi;
