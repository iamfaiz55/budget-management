import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";

interface RegisterFormInputs {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;  // ✅ Added this line
}

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (data: RegisterFormInputs) => {
    console.log("Register Data:", data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full"
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center">Create an Account</h2>
        <p className="text-gray-500 text-center mt-2">Join us and manage your finances easily</p>

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

          {/* Email Field */}
          <div className="relative mb-4">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "Invalid email format" }
              })}
              type="email"
              placeholder="Email"
              className="w-full pl-10 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.email?.message && (
              <p className="text-red-500 text-sm mt-1">{String(errors.email.message)}</p>
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

          {/* Confirm Password Field */}
          <div className="relative mb-4">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: value => value === watch("password") || "Passwords do not match",
              })}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full pl-10 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword?.message && (
              <p className="text-red-500 text-sm mt-1">{String(errors.confirmPassword.message)}</p>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-center text-sm mb-4">
            <input type="checkbox" {...register("terms", { required: "You must accept the terms" })} className="mr-2" />
            <p className="text-gray-600">
              I agree to the <a href="#" className="text-indigo-500 hover:underline">Terms & Conditions</a>
            </p>
          </div>
          {errors.terms && <p className="text-red-500 text-sm mb-4">{String(errors.terms.message)}</p>}

          {/* Register Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-500 transition"
          >
            Register
          </motion.button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-500 font-semibold hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
