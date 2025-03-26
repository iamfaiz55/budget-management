import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSignInMutation } from "../../redux/authApi";

interface LoginFormInputs {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [login, {isSuccess}]= useSignInMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: LoginFormInputs) => {
    console.log("Login Data:", data);
    login({email:data.username, password:data.password})
  };
useEffect(() => {
  
 if(isSuccess){
     console.log("login sucesss");
     
 }
}, [isSuccess]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full"
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center">Welcome Back</h2>
        <p className="text-gray-500 text-center mt-2">Manage your finances with ease</p>

        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Username Field */}
          <div className="relative mb-4">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              {...register("username", { required: "Username is required" })}
              type="text"
              placeholder="Username"
              className="w-full pl-10 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.username?.message && (
              <p className="text-red-500 text-sm mt-1">{String(errors.username.message)}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative mb-4">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-10 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password?.message && (
              <p className="text-red-500 text-sm mt-1">{String(errors.password.message)}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between text-sm mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember Me
            </label>
            <a href="#" className="text-indigo-500 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-500 transition"
          >
            Login
          </motion.button>
        </form>

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
