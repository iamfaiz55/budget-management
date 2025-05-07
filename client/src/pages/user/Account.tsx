
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignOutMutation } from "../../redux/authApi";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useGetAllPlansQuery } from "../../redux/planApi";
import { motion } from "framer-motion";
import { useBuyFreePlanMutation, useCreateSubscribeOrderMutation, useGetMyPlanQuery, useVerifyPaymentMutation } from "../../redux/subscriptionApi";
import { useGetAllTransactionsQuery } from "../../redux/transactionApi";

// import { MotionConfig } from "framer-motion";

const Account = () => {
  const [buyFreePlan, {isSuccess:freePlanBySuccess}]= useBuyFreePlanMutation()
    const { data } = useGetAllPlansQuery();
   const {data:myPlan}= useGetMyPlanQuery()
  //  console.log("my plan :", myPlan);
   const {data:allTransactions}= useGetAllTransactionsQuery()
  const [createPayment, {data:razorpayData, isSuccess:razorSuccess}]= useCreateSubscribeOrderMutation()
  const [verifyPayment, {isSuccess:isVerified }]= useVerifyPaymentMutation()
  const navigate = useNavigate();
  const [logout, { isSuccess }] = useSignOutMutation();
const {user}= useSelector((state :RootState) => state.auth)
  useEffect(() => {
    if (isSuccess) {
      // console.log("User logout success");
      navigate("/login");
    }
  }, [isSuccess]);
  
  useEffect(() => {
    // console.log("Razorpay Data:", razorpayData); 
    if (razorSuccess && razorpayData?.result?.key_id) {
      openRazorpay();
    } else {
      console.warn("Razorpay key_id is missing!");
    }
}, [razorSuccess, razorpayData]);

const handleBuyPlan = (planId: string, price: number) => {
  if (price === 0) {
    buyFreePlan({ planId });
  } else {
    createPayment({ planId });
  }
};


  
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        // console.log("Razorpay SDK Loaded");
        resolve(true);
      };
      script.onerror = (error) => {
        console.error("Failed to load Razorpay SDK:", error);
        reject(false);
      };
      document.body.appendChild(script);
    });
};
const openRazorpay = async () => {
  if (!razorpayData || !razorpayData.result?.key_id) {
    alert("Payment configuration is missing. Please try again.");
    return;
  }

  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    alert("Failed to load Razorpay SDK. Please check your internet connection.");
    return;
  }

  const { orderId, amount, currency, key_id } = razorpayData.result;

  // console.log("Initializing Razorpay with:", { key_id, orderId, amount, currency });

  const options = {
    key: key_id,
    amount: amount,
    currency: currency,
    name: "Your App Name",
    description: "Subscription Payment",
    order_id: orderId,
    handler: async function (response: any) {
      console.log("Payment Successful", {...response, planId:razorpayData.result.planId});

      // Verify payment after successful transaction
      await verifyPayment({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        planId:razorpayData.result.planId
      });
    },
    prefill: {
      name: user?.name || "Guest",
      email: user?.email || "guest@example.com",
    },
    theme: {
      color: "#3399cc",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};



  useEffect(() => {
    
      if(isVerified){
           navigate("/user/success")
          }
      if(freePlanBySuccess){
        navigate("/user/success")

      }
  }, [isVerified, freePlanBySuccess]);

  const calculateDaysLeft = (endDate: string | Date): number => {
    const end = new Date(endDate);
    const today = new Date();
    const difference = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(difference, 0);
};


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-14 bg-gray-100 min-h-screen space-y-6">
  {/* Profile Section */}
  <div className="bg-white flex flex-col sm:flex-row items-center sm:items-start p-6 rounded-lg shadow-md gap-4">
    <img
      src="https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg?semt=ais_hybrid"
      className="w-20 h-20 rounded-full"
      alt="Avatar"
    />
    <div className="text-center sm:text-left">
      <h2 className="text-xl font-bold">{user && user.name}</h2>
      <p className="text-gray-500">{user && user.email}</p>
    </div>
  </div>

  {/* Spending Summary */}
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 rounded-md text-sm sm:text-base">
      <span>Available Balance</span>
      <span className="font-bold text-blue-500">{allTransactions?.balance}</span>
    </div>
  </div>

  {/* Subscription Plans */}
  <h3 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
    {myPlan?.result?.isActive ? "Your Active Plan" : "Choose Your Plan"}
  </h3>

  {myPlan?.result?.isActive ? (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-6 md:p-10 rounded-lg shadow-xl bg-white text-center space-y-4"
    >
      <h3 className="text-2xl sm:text-3xl font-bold">🎉 Your Active Plan</h3>
      <p className="text-xl font-semibold text-green-600">{myPlan.result.plan.name}</p>
      <p className="text-gray-700 text-base sm:text-lg">💰 Price: <span className="font-bold">${myPlan.result.plan.price}</span></p>
      <p className="text-gray-700 text-base sm:text-lg">⏳ Duration: <span className="font-bold">{myPlan.result.plan.duration} Days</span></p>
      <p className="text-gray-700 text-base sm:text-lg">
        📅 Start Date: <span className="font-bold">{new Date(myPlan.result.startDate).toLocaleDateString("en-GB")}</span>
      </p>
      <p className="text-gray-700 text-base sm:text-lg">
        🚀 End Date: <span className="font-bold">{new Date(myPlan.result.endDate).toLocaleDateString("en-GB")}</span>
      </p>
      <p className="text-red-600 font-bold text-base sm:text-lg">⏳ Days Left: {calculateDaysLeft(myPlan.result.endDate)} Days</p>
    </motion.div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.result.map((plan, index) => (
        <motion.div
          key={plan._id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className="p-6 bg-white border rounded-2xl shadow-md text-center hover:shadow-xl transition-transform transform hover:scale-105"
        >
          <h3 className="text-xl font-semibold text-blue-600">{plan.name}</h3>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm text-gray-700">
            <p className="bg-gray-200 px-3 py-1 rounded-lg font-medium">💰 ${plan.price}</p>
            <p className="bg-gray-200 px-3 py-1 rounded-lg font-medium">👥 {plan.maxUsers} Users</p>
            <p className="bg-gray-200 px-3 py-1 rounded-lg font-medium">📅 {plan.duration} Days</p>
          </div>
          <div className="mt-6">
            <motion.button
              onClick={() => plan._id && handleBuyPlan(plan._id, plan.price)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-500 text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-yellow-400 transition"
            >
              Buy Plan
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  )}

  {/* Settings Section */}
  <div className="bg-white rounded-lg shadow-md divide-y">
    <OptionItem label="Settings" />
    <OptionItem label="Notifications" />
    <OptionItem label="Reports" />
    <OptionItem label="Help & Support" />
  </div>

  {/* Logout Button */}
  <button
    className="w-full bg-red-500 text-white px-4 py-3 rounded-md font-bold hover:bg-red-600 transition"
    onClick={() => logout()}
  >
    Logout
  </button>
</div>

  );
};

export default Account;

interface OptionItemProps {
  label: string;
}

const OptionItem: React.FC<OptionItemProps> = ({ label }) => (
  <button className="flex justify-between w-full px-4 py-3 border-b border-gray-200">
    <span>{label}</span>
    <span>›</span>
  </button>
);

interface SpendingItemProps {
  label: string;
  amount: string | number;
  color?: string;
}

const SpendingItem: React.FC<SpendingItemProps> = ({ label, amount, color }) => (
  <div className="flex justify-between p-2 bg-gray-50 rounded-md">
    <span>{label}</span>
    <span className={`font-bold ${color}`}>{amount}</span>
  </div>
);

interface PlanCardProps {
  title: string;
  price: string;
  features: string[];
  bgColor: string;
  textColor?: string;
}

const PlanCard: React.FC<PlanCardProps> = ({ title, price, features, bgColor, textColor = "text-black" }) => (
  <div className={`p-6 rounded-lg shadow-md ${bgColor} ${textColor} text-center`}>
    <h3 className="text-lg font-bold">{title}</h3>
    <p className="mt-1 text-sm">{features.join(" • ")}</p>
    <p className="mt-2 font-bold">{price}</p>
    <button className="mt-4 bg-white text-black px-4 py-2 rounded-md font-bold">
      Choose Plan
    </button>
  </div>
);

export { OptionItem, SpendingItem, PlanCard }