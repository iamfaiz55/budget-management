import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaUser, FaMobileAlt, FaKey, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  useRegisterMutation,
  useSendOtpRegisterMutation,
  useVerifyRegisterMutation,
} from "../../redux/authApi";

interface FormData {
  name: string;
  mobile: number;
  email: string;
  otp: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [registerUser] = useRegisterMutation();
  const [sendOTP, { isSuccess: otpSent, error: otpError }] = useSendOtpRegisterMutation();
  const [verifyOTP, { isSuccess: otpVerified, error: verifyError }] = useVerifyRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const mobile = watch("mobile");
  const otp = watch("otp");

  const [showOTP, setShowOTP] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Handle sending OTP
  const handleSendOTP = async () => {
    if (!mobile || mobile.toString().length !== 10) return;
    await sendOTP({ mobile });
  };

  // Handle verifying OTP
  const handleOTPVerification =  () => {
    if (!otp || !mobile) return;
  
    try {
       verifyOTP({ mobile, otp })
      // console.log("OTP verified:", response);
      setIsVerified(true); // ✅ persist success manually
    } catch (err) {
      console.error("OTP verification failed:", err);
    }
  };
  

  // Handle final registration submission
  const handleFinalRegister = async (data: FormData) => {
    // console.log("data : ", data);
    
    if (!isVerified) return;
    await registerUser(data);
    navigate("/login");
  };

  // React to OTP sent/verified
  useEffect(() => {
    if (otpSent) setShowOTP(true);
    if (otpVerified) {
      setIsVerified(true);
    }
  }, [otpSent, otpVerified, setIsVerified]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center">Register</h2>
        <p className="text-gray-500 text-center mt-2">Fill the form to continue</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(handleFinalRegister)}>
          {/* Name */}
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
              type="email"
              placeholder="Email"
              className="w-full pl-10 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Mobile + Get OTP */}
          <div className="relative">
            <FaMobileAlt className="absolute top-3 left-3 text-gray-400" />
            <input
              {...register("mobile", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit number",
                },
              })}
              type="tel"
              placeholder="Mobile Number"
              className="w-full pl-10 pr-[100px] p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
              disabled={showOTP}
            />
            {!showOTP && (
              <button
                type="button"
                onClick={handleSendOTP}
                className="absolute top-1 right-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 text-sm"
              >
                Get OTP
              </button>
            )}
            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>}
          </div>

          {/* OTP */}
          {showOTP && (
            <div className="space-y-2">
              <div className="relative">
                <FaKey className="absolute top-3 left-3 text-gray-400" />
                <input
                  {...register("otp", {
                    required: "OTP is required",
                    minLength: { value: 6, message: "OTP must be 6 digits" },
                  })}
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full pl-10 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOTPVerification}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-500 transition"
              >
                Verify OTP
              </motion.button>

              {verifyError && (
                <p className="text-red-500 text-sm text-center">Invalid OTP</p>
              )}
            </div>
          )}

          {/* Final Register Button */}
          <motion.button
  type="submit"
  disabled={!isVerified}
  whileHover={{ scale: isVerified ? 1.05 : 1 }}
  whileTap={{ scale: isVerified ? 0.95 : 1 }}
  className={`w-full py-3 rounded-lg font-semibold transition ${
    isVerified
      ? "bg-indigo-600 text-white hover:bg-indigo-500"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
>
  Register
</motion.button>

        </form>

        {/* OTP error */}
        {otpError && (
          <p className="text-red-500 text-sm text-center mt-4">Failed to send OTP</p>
        )}

        {/* Already have account */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
