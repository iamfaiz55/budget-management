import { validationRulesSchema } from "../utils/validator";

export const registerRules: validationRulesSchema = {
    username: { required: true },
    email: { required: true, email: true },
    password: { required: true, min: 8, max: 16 },
    profile: { required: false },
}

export const sendOTPRules: validationRulesSchema = {
    username: { required: true, email: true },
}

export const verifyOTPRules: validationRulesSchema = {
    username: { required: true, email: true },
    otp: { required: true }
}

export const signInRules: validationRulesSchema = {
    email: { required: true, email: true },
    password: { required: true }
}

export const forgotPasswordRules: validationRulesSchema = {
    email: { required: true, email: true },
}

export const resetPasswordRules: validationRulesSchema = {
    password: { required: true, min: 8, max: 16 },
    confirmPassword: { required: true },
}