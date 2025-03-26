// import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()

export const generateToken = (payload: Object) => {
    const secretKey = process.env.JWT_KEY

    if (!secretKey ) {
        throw new Error("JWT_KEY must be defined")
    }

    return jwt.sign(payload, secretKey, { expiresIn: "1d" })
}

export const generateResetToken = (payload: Object) => {
    const secretKey = process.env.JWT_KEY
    const expiry = process.env.JWT_RESET_TOKEN_EXPIRY

    if (!secretKey || !expiry) {
        throw new Error("JWT_KEY  must be defined")
    }

    return jwt.sign(payload, secretKey, { expiresIn: "1d" })
}
