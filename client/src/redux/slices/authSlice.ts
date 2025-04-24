import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../models/user.interface";
import { authApi } from "../authApi";

// Define initial state structure
interface AuthState {
    user: IUser | null;
    token: string | null;
    registerOTP: {
        otp:string| null,
        mobile:number|null
    };
    sessionExpiredOpen: boolean;
}

// Safely get user data from localStorage
const getUserFromLocalStorage = (): IUser | null => {
    try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        return null;
    }
};
const getRegisterOTPFromLocalStorage = (): { otp: string | null; mobile: number | null } => {
    try {
        const otp = localStorage.getItem("registerOTP");
        return otp ? JSON.parse(otp) : { otp: null, mobile: null };
    } catch (error) {
        console.error("Error parsing registerOTP from localStorage:", error);
        return { otp: null, mobile: null };
    }
};


// Define initial state
const initialState: AuthState = {
    user: getUserFromLocalStorage(),
    token: getUserFromLocalStorage()?.token || null, 
    registerOTP: getRegisterOTPFromLocalStorage(),
    sessionExpiredOpen: false,
};

// Create Redux slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("user");
        },
        openSessionExpiredModal: (state) => {
            state.sessionExpiredOpen = true;
        },
        addDataFor: (state) => {
            state.sessionExpiredOpen = false;
        },
    },
    extraReducers: (builder) =>
        builder
            .addMatcher(authApi.endpoints.verifyOtp.matchFulfilled, (state, { payload }) => {
                localStorage.setItem("user", JSON.stringify(payload.result));
                state.user = payload.result;
                state.token = payload.result.token || null; // Ensure token is stored
            })
            .addMatcher(authApi.endpoints.googleLogin.matchFulfilled, (state, { payload }) => {
                localStorage.setItem("user", JSON.stringify(payload.result));
                state.user = payload.result;
                state.token = payload.result.token || null;
            })
            .addMatcher(authApi.endpoints.register.matchFulfilled, (state, { payload }) => {
                localStorage.setItem("user", JSON.stringify(payload.result));
                state.user = payload.result;
                // console.log("payload.result.token", payload.result.token);
                
                state.token = payload.result.token || null; 
            })
            .addMatcher(authApi.endpoints.signOut.matchFulfilled, (state) => {
                state.user = null;
                state.token = null;
                localStorage.removeItem("user");
            })
            .addMatcher(authApi.endpoints.sendOtpRegister.matchFulfilled, (state, { payload }) => {
                localStorage.setItem("registerOTP", JSON.stringify(payload));
                state.registerOTP = payload.result;
            })
});

// Export actions
// export const { logoutUser, openSessionExpiredModal } = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Export type
export type { AuthState };
