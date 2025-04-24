import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Success = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    // Navigate after countdown reaches 0
    if (countdown === 0) {
      navigate("/user/account");
    }

    return () => clearInterval(interval);
  }, [countdown, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg p-6 rounded-2xl text-center"
      >
        <motion.h1
          className="text-2xl font-bold text-green-600 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Payment Successful! 🎉
        </motion.h1>

        <motion.p
          className="text-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Redirecting to your account in <span className="font-bold text-green-600">{countdown}</span> seconds...
        </motion.p>

        <motion.div
          className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
        >
          <motion.div
            className="h-3 bg-green-500 rounded-full"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Success;
