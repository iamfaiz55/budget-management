// import React from "react";
import Mobile from "../assets/mobile.png";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaChartLine, FaShieldAlt, FaUserShield, FaWallet, FaChartPie, FaUniversity, FaTags, FaLock } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import styles for Carousel
import { Button } from "@headlessui/react";
import { useEffect, useState } from "react";
import { ShieldCheck, TrendingUp, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate()
  const stats = [
    { value: 500000, label: "Users Trusting Us", icon: <User size={48} /> },
    { value: 1000000, label: "Transactions Managed", icon: <TrendingUp size={48} /> },
    { value: 99.9, label: "Uptime & Security", icon: <ShieldCheck size={48} /> },
  ];

  const x = () =>{
    navigate("/login")
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
  <div className="absolute inset-0  bg-opacity-30"></div>

  <motion.div 
    className="relative z-10 container mx-auto px-6 md:px-12"
    initial={{ opacity: 0, y: -30 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.8 }}
  >
    <h1 className="text-5xl font-bold mb-4 tracking-wide text-black">
      Take Control of Your <span className="text-yellow-400">Finances</span>
    </h1>
    <p className="text-lg max-w-2xl mx-auto mb-6 text-black">
      Budget smarter, save more, and achieve financial freedom with BudgetMaster.
    </p>

    <div className="flex flex-wrap justify-center gap-4">
      <motion.p
        // href="/login"
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
  <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-6 w-full max-w-3xl">
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
        <span className="text-sm font-semibold">{item.text}</span>
      </motion.div>
    ))}
  </div>
</header>


      {/* Benefits Section */}
      <section className="py-20 container mx-auto text-center bg-white">
        <h2 className="text-4xl font-semibold mb-10">Why Use BudgetMaster?</h2>
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
<section className="py-20 bg-white">
  <div className="container mx-auto text-center">
    
    <h2 className="text-4xl font-semibold mb-6 text-indigo-700">
      Explore Our Powerful Features
    </h2>
    <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
      Discover the tools that help you take control of your finances with ease and efficiency.
    </p>

    <div className="relative max-w-3xl mx-auto">
      <Carousel 
        showArrows={true} 
        autoPlay 
        infiniteLoop 
        interval={4000} 
        transitionTime={1000}
        showThumbs={false}
        showStatus={false}
        className="rounded-lg shadow-xl overflow-hidden"
      >
        {[
          { img: "https://www.collidu.com/media/catalog/product/img/1/3/13c094ff0e6617b88893666970b0cf2db18076f3f7654bb10c6dcb8b40683df1/budget-management-slide1.png", title: "Smart Budgeting", desc: "Easily set and track your budgets for better financial control." },
          { img: "https://www.researchgate.net/publication/369379322/figure/fig1/AS:11431281207659479@1701312684430/Features-of-financial-management.png", title: "Analytics & Insights", desc: "Visualize your spending with powerful analytics and reports." },
          { img: "https://www.cflowapps.com/wp-content/uploads/2021/11/budgt_mngmnt.jpg", title: "Expense Tracking", desc: "Monitor every transaction and stay on top of your finances." },
        ].map((slide, index) => (
          <motion.div 
            key={index} 
            className="relative flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-lg"
            initial={{ opacity: 0.8, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8 }}
          >
            <img 
              src={slide.img} 
              alt={`Feature ${index + 1}`} 
              className="rounded-lg object-cover w-80 h-60 md:w-96 md:h-72"
            />
            <div className="text-center mt-4">
              <h3 className="text-xl font-semibold text-indigo-700">{slide.title}</h3>
              <p className="text-gray-600 text-sm">{slide.desc}</p>
            </div>
          </motion.div>
        ))}
      </Carousel>
    </div>

  </div>
</section>



{/* Features Section */}
<section className="py-20 bg-white">
  <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
    
    {/* Left Side - Mobile Image */}
    <motion.div 
      className="w-full md:w-1/3 flex justify-center"
      initial={{ opacity: 0, x: -50 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.8 }}
    >
      <img 
        src={Mobile} 
        alt="Analysis Screenshot" 
        className="w-2/3 md:w-3/4 max-w-xs rounded-lg shadow-xl"
      />
    </motion.div>

    {/* Right Side - Feature Details */}
    <motion.div 
      className="w-full md:w-2/3 text-center md:text-left"
      initial={{ opacity: 0, x: 50 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-4xl font-semibold mb-6">
        Designed for Simplicity, Built for Security
      </h2>
      <p className="text-gray-600 mb-8">
        Discover the suite of features that make Expenses Manager the ultimate tool for your money management.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { icon: FaWallet, title: "Budget Planner", desc: "Set budgets for different categories and monitor your spending against them." },
          { icon: FaChartPie, title: "Insightful Analytics", desc: "Visualize your spending. Gain insights with detailed analytics and predictions." },
          { icon: FaUniversity, title: "Account Management", desc: "Efficiently manage all your accounts in one place. Add transactions and track account balances." },
          { icon: FaTags, title: "Tags & Categories", desc: "Personalize your tracking. Organize expenses with custom tags and categories." },
          { icon: FaLock, title: "Privacy-First App", desc: "Your data never leaves your device. No clouds, no servers, no peeping eyes." },
          { icon: FaShieldAlt, title: "Secure Backups", desc: "Retain your expenses history with encrypted backups, ensuring maximum security." }
        ].map((feature, index) => (
          <motion.div 
            key={index} 
            className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center text-center h-48 w-48"
            whileHover={{ scale: 1.05, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)" }}
          >
            <feature.icon className="text-4xl text-indigo-600 mb-4" />
            <h3 className="text-lg font-semibold text-indigo-600">{feature.title}</h3>
            <p className="text-sm text-gray-700">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

    </motion.div>
  </div>

  {/* Stats Section */}
  <div className="relative bg-indigo-700 text-white py-12">
      {/* Wave Background */}
      <svg className="absolute top-0 left-0 w-full h-12" viewBox="0 0 1440 160" fill="none">
        <path fill="#4F46E5" d="M0,32L1440,96L1440,160L0,160Z"></path>
      </svg>

      <div className="container mx-auto flex flex-col md:flex-row justify-center gap-6 text-center">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center"
          >
            {stat.icon}
            <h3 className="text-4xl font-extrabold text-white drop-shadow-md mt-2">
              {counts[index].toLocaleString()}+
            </h3>
            <p className="text-base mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Bottom Wave */}
      <svg className="absolute bottom-0 left-0 w-full h-12" viewBox="0 0 1440 160" fill="none">
        <path fill="#4F46E5" d="M0,96L1440,32L1440,160L0,160Z"></path>
      </svg>
    </div>
</section>

{/* Pricing Plans */}
<section className="py-20 bg-gray-100">
  <div className="container mx-auto text-center">
    
    <h2 className="text-4xl font-semibold mb-10 text-indigo-700">
      Choose the Perfect Plan for You
    </h2>
    <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
      Whether you're just getting started or need advanced features, we have a plan that fits your needs.
    </p>

    <div className="grid md:grid-cols-3 gap-8">
      {[
        { 
          name: "Free", 
          price: "$0", 
          features: ["Basic Expense Tracking", "Monthly Reports", "Community Support"], 
          highlight: false 
        },
        { 
          name: "Pro", 
          price: "$9.99/mo", 
          features: ["Unlimited Categories", "Advanced Analytics", "Priority Support"], 
          highlight: true 
        },
        { 
          name: "Enterprise", 
          price: "$29.99/mo", 
          features: ["Multi-User Access", "Custom Reports", "Dedicated Support"], 
          highlight: false 
        }
      ].map((plan, index) => (
        <motion.div 
          key={index} 
          className={`p-8 rounded-lg shadow-lg border ${plan.highlight ? "bg-indigo-600 text-white" : "bg-white"}`}
          whileHover={{ scale: 1.05 }}
        >
          <h3 className={`text-2xl font-semibold mb-4 ${plan.highlight ? "text-white" : "text-indigo-700"}`}>
            {plan.name} Plan
          </h3>
          <p className={`text-4xl font-bold mb-6 ${plan.highlight ? "text-white" : "text-gray-800"}`}>
            {plan.price}
          </p>

          <ul className="mb-6 space-y-3 text-sm">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-center justify-center gap-2">
                ✅ <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button className={`px-6 py-3 font-bold rounded-lg transition ${plan.highlight ? "bg-white text-indigo-600 hover:bg-gray-200" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
            Get Started
          </Button>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* Footer */}
      <footer className="py-10 bg-gray-900 text-white text-center">
        <p>&copy; {new Date().getFullYear()} BudgetMaster. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Welcome;
