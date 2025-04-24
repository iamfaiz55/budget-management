import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "@/models/user.interface";
// import { IUser } from "../../models/user.interface";
console.log("env----:", process.env.EXPO_PUBLIC_BACKEND_URL);

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
        // baseUrl: "http://192.168.54.208:5000/api/v1/auth",
        baseUrl: `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/auth`,
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
export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
    endpoints: (builder) => ({
        // signIn: builder.mutation<{ message: string; result:{otp:string}}, { username:string }>({
        //     query: (userData) => ({
        //         url: "/sign-in",
        //         method: "POST",
        //         body: userData,
        //     }),
        //     async transformResponse(data: { message: string; result:{otp:string}}) {
        //         // await AsyncStorage.setItem("authToken", data.result.token|| "");
        //         return data;
        //     },
        //     transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        // }),
        signIn: builder.mutation<{ message: string; result: { otp: string } }, { username: string }>({
            query: (userData) => {
              console.log('Sending OTP request for username:', userData); // Log username
              return {
                url: "/send-otp",
                method: "POST",
                body: userData,
              };
            },
            async transformResponse(data: { message: string; result: { otp: string } }) {
              console.log('OTP sent successfully:', data.result.otp); // Log OTP received from the response
              try {
                // Save OTP to AsyncStorage
                await AsyncStorage.setItem("loginOtp", data.result.otp || "");
                console.log('OTP stored successfully in AsyncStorage');
              } catch (error) {
                console.error('Error saving OTP to AsyncStorage:', error); // Log any error in AsyncStorage
              }
              return data;
            },
            transformErrorResponse: (error: { status: number; data: { message: string } }) => {
              console.error('Error sending OTP:', error.data?.message || 'Unknown error'); // Log the error message
              return error.data; // Return the error message
            },
          }),
          

        signOut: builder.mutation<string, void>({
            queryFn: async () => {
                try {
                    const token = await AsyncStorage.getItem("authToken");
        
                    if (!token) {
                        return { error: { status: 401, data: { message: "No token found" } } };
                    }
        
                    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/auth/sign-out`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });
        
                    if (!response.ok) {
                        const errorData = await response.json();
                        return { error: { status: response.status, data: errorData } };
                    }
        
                    await AsyncStorage.removeItem("authToken");
                    const data = await response.json();
                    return { data: data.message };
                } catch (error) {
                    return { error: { status: 500, data: { message: "Logout failed. Please try again." } } };
                }
            },
        }),
        
        

        sendOtpRegister: builder.mutation<{ message: string; result: { otp: string , mobile:number} }, {  mobile: string }>({
            query: (username) => ({
                url: "/send-otp-register",
                method: "POST",
                body: username,
            }),
            // transformResponse: (data:{ message:string, result:{otp: string , mobile:number}} ),
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
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
        googleLogin: builder.mutation<{ message: string; result:  IUser  }, { idToken:string }>({
            query: (userData) => ({
                url: "/google-login",
                method: "POST",
                body: userData, 
            }),
            transformResponse: (data: { message: string, result: IUser  }) => data,
        }),
        register: builder.mutation<string, any>({
            query: (userData) => ({
                url: "/register",
                method: "POST",
                body: userData,
            }),
        }),
        sendOTP: builder.mutation<string, { username: string }>({
            query: (username) => ({
                url: "/send-otp",
                method: "POST",
                body: username,
            }),
            transformResponse: (data: { message: string }) => data.message,
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),

        verifyOTP: builder.mutation<{ message: string, result: IUser  }, { username: string; otp: string }>({
            query: (userData) => ({
                url: "/verify-otp",
                method: "POST",
                body: userData,
            }),
            transformResponse: (data: { message: string, result: IUser  }) => data,
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data.message,
        }),
      
      
    }),
});

// Export Hooks
export const {
    useSignInMutation,
    useSignOutMutation,
    useSendOTPMutation,
    useVerifyOTPMutation,
    useRegisterMutation,
    useVerifyRegisterMutation,
    useSendOtpRegisterMutation,
    useGoogleLoginMutation
} = authApi;
