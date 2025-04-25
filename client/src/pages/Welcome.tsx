// import React from "react";
import Mobile from "./../../public/stats.png";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaChartLine, FaShieldAlt, FaUserShield, FaWallet, FaChartPie, FaUniversity, FaTags, FaLock } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import styles for Carousel
import { useEffect, useState } from "react";
import { ShieldCheck, TrendingUp, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useGetAllPlansQuery } from "../redux/planApi";

const Welcome = () => {
    const { data } = useGetAllPlansQuery();
  
  const navigate = useNavigate()
  const stats = [
    { value: 500000, label: "Users Trusting Us", icon: <User size={48} /> },
    { value: 1000000, label: "Transactions Managed", icon: <TrendingUp size={48} /> },
    { value: 99.9, label: "Uptime & Security", icon: <ShieldCheck size={48} /> },
  ];
const {user}:any= useSelector((state:RootState)=> state.auth)
  const x = () =>{
    if(user){
      navigate("/user")
    }else{
      navigate("/login")

    }
  }
  // Animated Counter
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const timers = stats.map((stat, index) => {
      return setInterval(() => {
        setCounts((prev) =>
          prev.map((count, i) =>
            i === index ? Math.min(stat.value, count + Math.ceil(stat.value / 100)) : count
          )
        );
      }, 20);
    });

    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
  <header 
  className="relative bg-gradient-to-r from-indigo-700 to-purple-600 text-white text-center py-32"
  style={{ backgroundImage: `url('https://img.freepik.com/free-vector/flat-design-grid-background_23-2150525345.jpg?t=st=1742977853~exp=1742981453~hmac=a68db12c6289bb2a1f547596a4bbf654767e971f48404bf98275edf1c414fab0&w=1380')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
>
  <div className="absolute inset-0 bg-opacity-30"></div>

  <motion.div 
    className="relative z-10 container mx-auto px-6 md:px-12"
    initial={{ opacity: 0, y: -30 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.8 }}
  >
    <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-wide text-black">
      Take Control of Your <span className="text-yellow-400">Finances</span>
    </h1>
    <p className="text-base sm:text-lg max-w-2xl mx-auto mb-6 text-black">
      Budget smarter, save more, and achieve financial freedom with BudgetMaster.
    </p>

    <div className="flex flex-wrap justify-center gap-4">
      <motion.p
        onClick={x}
        className="px-6 py-3 text-lg font-semibold bg-yellow-400 text-gray-900 rounded-lg shadow-lg hover:bg-yellow-300 transition duration-300"
        whileHover={{ scale: 1.1 }}
      >
        Get Started
      </motion.p>
      
      <motion.a 
        href="#features" 
        className="px-6 py-3 text-lg font-semibold border-2 border-black text-black rounded-lg shadow-lg hover:bg-white hover:text-indigo-700 transition duration-300"
        whileHover={{ scale: 1.1 }}
        onClick={(e) => {
          e.preventDefault();
          window.scrollBy({ top: 500, behavior: "smooth" });
        }}
      >
        Explore Features
      </motion.a>
    </div>
  </motion.div>

  {/* Floating Features */}
  <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-6 w-full max-w-3xl sm:max-w-full">
    {[ 
      { icon: FaWallet, text: "Expense Tracking" },
      { icon: FaChartPie, text: "Smart Budgeting" },
      { icon: FaShieldAlt, text: "Data Security" },
      { icon: FaChartLine, text: "Financial Insights" },
    ].map((item, index) => (
      <motion.div 
        key={index}
        className="p-4 bg-white text-gray-800 rounded-lg shadow-md flex items-center gap-3 transition transform hover:scale-105"
        whileHover={{ scale: 1.1 }}
      >
        <item.icon className="text-indigo-700 text-2xl" />
        <span className="text-xs sm:text-sm font-semibold">{item.text}</span>
      </motion.div>
    ))}
  </div>
</header>


      {/* Benefits Section */}
      <section className="py-20 container mx-auto text-center bg-white">
        <h2 className="text-4xl font-semibold mb-10 ">Why Use BudgetMaster?</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { icon: FaMoneyBillWave, title: "Track Expenses", desc: "Monitor your daily spending easily." },
            { icon: FaChartLine, title: "Financial Insights", desc: "Get detailed analytics and reports." },
            { icon: FaShieldAlt, title: "Secure Data", desc: "Your data is encrypted and safe." },
            { icon: FaUserShield, title: "User-Friendly", desc: "Simple and intuitive interface." }
          ].map((benefit, index) => (
            <motion.div 
              key={index} 
              className="p-6 bg-white rounded-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <benefit.icon className="text-4xl text-indigo-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p>{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

{/* Carousel Section */}
<section className="py-10 bg-white">
  <div className="container mx-auto text-center px-4">
    <h2 className="text-4xl font-semibold mb-6 text-indigo-700">
      Explore Our Powerful Features
    </h2>
    <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
      Discover the tools that help you take control of your finances with ease and efficiency.
    </p>

    <div className="relative w-full max-w-full mx-auto">
      <Carousel
        showArrows={true}
        autoPlay
        infiniteLoop
        interval={5000}
        transitionTime={1200}
        showThumbs={false}
        showStatus={false}
        className="rounded-xl shadow-2xl overflow-hidden"
        renderArrowPrev={(onClickHandler, hasPrev, label) => (
          <button
            onClick={onClickHandler}
            title={label}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition"
          >
            &lt;
          </button>
        )}
        renderArrowNext={(onClickHandler, hasNext, label) => (
          <button
            onClick={onClickHandler}
            title={label}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition"
          >
            &gt;
          </button>
        )}
      >
        {[ 
          { 
            img: "https://www.collidu.com/media/catalog/product/img/1/3/13c094ff0e6617b88893666970b0cf2db18076f3f7654bb10c6dcb8b40683df1/budget-management-slide1.png", 
            title: "Smart Budgeting", 
            desc: "Easily set and track your budgets for better financial control.", 
            cta: "Start Budgeting"
          },
          { 
            img: "https://www.researchgate.net/publication/369379322/figure/fig1/AS:11431281207659479@1701312684430/Features-of-financial-management.png", 
            title: "Analytics & Insights", 
            desc: "Visualize your spending with powerful analytics and reports.", 
            cta: "See Your Insights"
          },
          { 
            img: "https://www.cflowapps.com/wp-content/uploads/2021/11/budgt_mngmnt.jpg", 
            title: "Expense Tracking", 
            desc: "Monitor every transaction and stay on top of your finances.", 
            cta: "Track Expenses"
          },
        ].map((slide, index) => (
          <motion.div
            key={index}
            className="relative flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-2xl"
            initial={{ opacity: 0.7, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: index * 0.3 }}
          >
            {/* Updated Image to Ensure Full View */}
            <img
              src={slide.img}
              alt={`Feature ${index + 1}`}
              className="rounded-xl object-contain w-full md:w-2/3 h-[350px] md:h-[450px] mx-auto"  
            />
            <div className="absolute top-4 left-4 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Featured
            </div>
            <div className="text-center mt-6">
              <h3 className="text-2xl font-semibold text-indigo-700">{slide.title}</h3>
              <p className="text-gray-600 text-base mb-4">{slide.desc}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:bg-indigo-700 transition"
              >
                {slide.cta}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </Carousel>
    </div>
  </div>
</section>


{/* Mobile App Screenshots */}
<section className="py-20 bg-white">
  <div className="container mx-auto text-center">
    <h2 className="text-4xl font-semibold mb-8 text-indigo-700">
      Mobile App Screenshots
    </h2>
    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
      A sneak peek into how our mobile app helps you manage your finances seamlessly.
    </p>
    <p className="text-gray-700 mb-10 max-w-3xl mx-auto">
      And many more features like selected date statement, tracking family transactions in one screen, adding your members and sharing expenses — so you can track every amount you spend, together.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4">
      {[
        {
          img: "https://res.cloudinary.com/dpc5d15ci/image/upload/v1745576699/account_texpbs.png",
          label: "Account Overview"
        },
        {
          img: "https://res.cloudinary.com/dpc5d15ci/image/upload/v1745576864/add_hsfckb.png",
          label: "Add Transaction"
        },
        {
          img: "https://res.cloudinary.com/dpc5d15ci/image/upload/v1745576873/calender_lnw9ss.png",
          label: "Calendar View"
        },
        {
          img: "https://res.cloudinary.com/dpc5d15ci/image/upload/v1745576882/monthly_snrq78.png",
          label: "Monthly Transactions"
        },
        {
          img: "https://res.cloudinary.com/dpc5d15ci/image/upload/v1745576889/stats_xgrcfg.png",
          label: "Statistics Dashboard"
        }
      ].map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <img
            src={item.img}
            alt={item.label}
            className="rounded-xl object-cover w-full h-[400px] shadow-md"
          />
          <p className="text-lg font-semibold text-gray-700 mt-4">{item.label}</p>
        </div>
      ))}
    </div>
  </div>
</section>



{/* Features Section */}
<section className="py-20 bg-white">
  <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">

    {/* Left Side - Mobile Image */}
    <motion.div 
      className="w-full md:w-1/2 flex justify-center"
      initial={{ opacity: 0, x: -50 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.8 }}
    >
      <img 
        src="https://res.cloudinary.com/dpc5d15ci/image/upload/v1745576699/account_texpbs.png" 
        alt="Analysis Screenshot"
        className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg shadow-xl"
      />
    </motion.div>

    {/* Right Side - Feature Details */}
    <motion.div 
      className="w-full md:w-1/2"
      initial={{ opacity: 0, x: 50 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-4xl font-semibold mb-6 text-center md:text-left">
        Designed for Simplicity, Built for Security
      </h2>
      <p className="text-gray-600 mb-10 text-center md:text-left">
        Discover the suite of features that make Expenses Manager the ultimate tool for your money management.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { icon: FaWallet, title: "Budget Planner", desc: "Set budgets for different categories and monitor your spending against them." },
          { icon: FaChartPie, title: "Insightful Analytics", desc: "Visualize your spending. Gain insights with detailed analytics and predictions." },
          { icon: FaUniversity, title: "Account Management", desc: "Efficiently manage all your accounts in one place. Add transactions and track balances." },
          { icon: FaTags, title: "Tags & Categories", desc: "Organize expenses with custom tags and categories for more clarity." },
          { icon: FaLock, title: "Privacy-First App", desc: "Your data never leaves your device. No clouds, no servers, no peeping eyes." },
          { icon: FaShieldAlt, title: "Secure Backups", desc: "Encrypted backups make sure your data stays safe and retrievable." }
        ].map((feature, index) => (
          <motion.div 
            key={index} 
            className="bg-gray-50 rounded-xl p-5 shadow hover:shadow-lg transition-all flex flex-col items-center text-center"
            whileHover={{ scale: 1.03 }}
          >
            <feature.icon className="text-4xl text-indigo-600 mb-3" />
            <h3 className="text-lg font-semibold text-indigo-700 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-700">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>

  <div className="relative bg-indigo-700 text-white mt-20 py-12">
  {/* Top Wave */}
  <svg className="absolute top-0 left-0 w-full h-12" viewBox="0 0 1440 160" fill="none">
    <path fill="#4F46E5" d="M0,32L1440,96L1440,160L0,160Z"></path>
  </svg>

  <div className="container mx-auto flex flex-wrap justify-center gap-6 text-center z-10 relative">
    {stats.map((stat, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        whileHover={{ scale: 1.05 }}
        className="bg-white/10 backdrop-blur-sm px-4 py-6 rounded-xl shadow-md hover:shadow-lg flex flex-col items-center w-36 sm:w-40 md:w-48"
      >
        {stat.icon}
        <h3 className="text-2xl sm:text-3xl font-extrabold mt-2">
          {counts[index].toLocaleString()}+
        </h3>
        <p className="text-sm sm:text-base mt-1">{stat.label}</p>
      </motion.div>
    ))}
  </div>

  {/* Bottom Wave */}
  <svg className="absolute bottom-0 left-0 w-full h-12" viewBox="0 0 1440 160" fill="none">
    <path fill="#4F46E5" d="M0,96L1440,32L1440,160L0,160Z"></path>
  </svg>
</div>

</section>





<section className="py-20 bg-gray-100">
  <div className="container mx-auto text-center px-4">
    
    <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-indigo-700">
      Choose the Perfect Plan for You
    </h2>
    <p className="text-base sm:text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
      Whether you're just getting started or need advanced features, we have a plan that fits your needs.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {data &&
        data.result.map((plan, index) => {
          const isPopular = plan.name.toLowerCase().includes("pro") || plan.name.toLowerCase().includes("plus");
          return (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative p-6 sm:p-8 bg-white border rounded-3xl shadow-lg text-center transition-transform hover:shadow-2xl hover:scale-105 ${
                isPopular ? "border-indigo-600" : ""
              }`}
            >
              {isPopular && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  ★ Most Popular
                </div>
              )}

              <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-3">{plan.name}</h3>

              <p className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4">
                ${plan.price}
              </p>

              <div className="flex flex-col items-center space-y-2 mb-6 text-sm sm:text-base text-gray-700">
                <div className="bg-gray-100 w-full py-2 rounded-lg font-medium">
                  👥 {plan.maxUsers} Users
                </div>
                <div className="bg-gray-100 w-full py-2 rounded-lg font-medium">
                  📅 Valid for {plan.duration} Days
                </div>
                {/* Add more features here if needed */}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-indigo-700 transition"
              >
                Get Started
              </motion.button>
            </motion.div>
          );
        })}
    </div>
  </div>
</section>



<footer className="py-16 bg-gray-900 text-white text-center">
  <div className="container mx-auto">
    {/* Footer Content */}
    <div className="space-y-4">
      {/* Copyright Information */}
      <p className="text-sm">
        &copy; {new Date().getFullYear()} BudgetMaster. All rights reserved.
      </p>

      {/* Developer and Maintainer Information */}
      <p className="text-sm">
        Developed by <span className="font-semibold text-indigo-400">Shaikh Faiz</span>
      </p>
      <p className="text-sm">
        Maintained by <span className="font-semibold text-indigo-400">Matic UI</span>
      </p>
      
      {/* Social Links */}
      <div className="flex justify-center gap-6 mt-6">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-400 transition-colors">
          <i className="fab fa-twitter text-2xl"></i>
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-400 transition-colors">
          <i className="fab fa-github text-2xl"></i>
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-400 transition-colors">
          <i className="fab fa-linkedin text-2xl"></i>
        </a>
      </div>

      {/* Terms and Privacy */}
      <div className="text-sm text-white/70 mt-6">
        <a href="/terms" className="hover:text-indigo-400 mx-2">Terms of Service</a> | 
        <a href="/privacy" className="hover:text-indigo-400 mx-2">Privacy Policy</a>
      </div>
    </div>
  </div>
  
  {/* Footer Bottom Wave */}
  <svg className="bottom-0 left-0 w-full h-12" viewBox="0 0 1440 160" fill="none">
    <path fill="#4F46E5" d="M0,96L1440,32L1440,160L0,160Z"></path>
  </svg>
</footer>

    </div>
  );
};

export default Welcome;
