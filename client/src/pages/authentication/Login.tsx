import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaUser, FaKey } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLoginMutation, useSignInMutation, useVerifyOtpMutation } from "../../redux/authApi";
import { GoogleLogin } from "@react-oauth/google";
// import { GoogleLogin } from '@react-oauth/google';

interface OTPLoginFormInputs {
  username: string;
  otp?: string;
}

const Login: React.FC = () => {
  const [googleLogin2, {isSuccess:googleSuccess}]= useGoogleLoginMutation()
  const navigate = useNavigate();
  const [sendOTP, { isSuccess: otpSent, isError, error }] = useSignInMutation();
  const [verifyOTP, { isSuccess: verified, data: verifyData }] = useVerifyOtpMutation();
  const handleGoogleSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      console.log("Google User Info:",credentialResponse.credential);
      googleLogin2({idToken:credentialResponse.credential})
      // Example: Navigate based on email or role
      // if (decoded.email === 'admin@example.com') navigate('/admin');
      // else navigate('/user');
    }
  };
  
  const handleGoogleError = () => {
    alert("Google Login Failed");
  };
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<OTPLoginFormInputs>();

  const username = watch("username");
  const otp = watch("otp");

  const [otpFieldVisible, setOtpFieldVisible] = useState(false);
  const [otpDisabled, setOtpDisabled] = useState(true);

  const handleSendOTP = (formData: OTPLoginFormInputs) => {
    if (formData.username) {
      sendOTP({ username: formData.username });
    }
  };

  const handleVerifyOTP = () => {
    if (otp && username) {
      verifyOTP({ username, otp });
    }
  };

  useEffect(() => {
    if (otpSent) {
      setOtpFieldVisible(true);
      setOtpDisabled(false);
    }
  }, [otpSent]);

  useEffect(() => {
    if (verified && verifyData?.result) {
      const { role } = verifyData.result;
      if (role === "admin") navigate("/admin");
      else if (role === "user") navigate("/user");
    }
  }, [verified]);
  useEffect(() => {
    if (googleSuccess) {
      
      navigate("/user");
    }
  }, [googleSuccess]);

  useEffect(() => {
    
   if(isError){
    // console.log(error);
    
alert(error)
   }
  }, [isError]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center">Login with OTP</h2>
        <p className="text-gray-500 text-center mt-2">No password required ✨</p>

        {/* Username input */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(handleSendOTP)}>
  <div className="flex items-center space-x-2">
    <div className="relative flex-grow">
      <FaUser className="absolute top-3 left-3 text-gray-400" />
      <input
        {...register("username", { required: "Username (Email or Mobile) is required" })}
        type="text"
        placeholder="Email or Mobile"
        className="w-full pl-10 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>

    <motion.button
      type="submit"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-500 transition whitespace-nowrap"
    >
      Send OTP
    </motion.button>
  </div>
  {errors.username && (
    <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
  )}
</form>
<div className="mt-6">
  <p className="text-center text-gray-500 mb-2">Or</p>
  <div className="flex justify-center">
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleError}
    />
  </div>
</div>


        {/* OTP Field */}
        {otpFieldVisible && (
          <div className="mt-4 space-y-2">
            <div className="relative">
              <FaKey className="absolute top-3 left-3 text-gray-400" />
              <input
                {...register("otp", {
                  required: "OTP is required",
                  minLength: { value: 6, message: "OTP must be 6 digits" },
                })}
                type="text"
                placeholder="Enter OTP"
                disabled={otpDisabled}
                className={`w-full pl-10 p-3 rounded-lg border focus:outline-none ${
                  otpDisabled ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-green-400"
                }`}
              />
              {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
            </div>

            <motion.button
              type="button"
              onClick={handleVerifyOTP}
              whileHover={{ scale: otp && !otpDisabled ? 1.05 : 1 }}
              whileTap={{ scale: otp && !otpDisabled ? 0.95 : 1 }}
              disabled={otpDisabled}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                otpDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-500"
              }`}
            >
              Verify OTP
            </motion.button>
          </div>
        )}

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-500 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
