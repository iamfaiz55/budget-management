import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaCalendarAlt, FaTag, FaMoneyBill, FaWallet, FaStickyNote, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useAddTransactionMutation } from "../redux/transactionApi";
import { ICategory, ITransaction } from "../models/transaction.interface";
import { useGetCategoriesQuery } from "../redux/categoryApi";


const transactionSchema = z.object({
  date: z.string().nonempty("Date is required"),
  note: z.string().min(3, "Note must be at least 3 characters long"),
  type: z.string(),
  category: z.string().nonempty("Category is required"),
  amount: z.number().positive("Amount must be a positive number"),
  account: z.string().nonempty("Account is required"),
});

const accounts: string[] = ["Cash", "Card", "Account"];

const TransactionForm: React.FC = () => {
  const {data}= useGetCategoriesQuery()
  const { date } = useParams<{ date?: string }>();
  const navigate = useNavigate();
  const [addTransaction, {isSuccess, isLoading}]= useAddTransactionMutation()
  const today = new Date().toISOString().split("T")[0];
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ITransaction>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { date: date || today, type: "expense", category: "", amount: 0, account: "" ,note: "",},
  });

  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  // const [categories] = useState<string[]>(initialCategories);
  const categories = data?.result?.filter(
    (cat: ICategory) => cat.type === transactionType
  ) ?? [];
  
  useEffect(() => {
    setValue("type", transactionType);
  }, [transactionType, setValue]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setValue("category", category);
  };

  const onSubmitForm = (data: ITransaction) => {
    // console.log("Transaction Data:", data);
    addTransaction(data)
    reset();
  };

  useEffect(() => {
    
    if(isSuccess){
      navigate(-1)
    }
    if(isLoading){
      // console.log("loading....");
      
    }
  }, [isSuccess, isLoading]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition mb-4"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
        <h2 className="text-3xl font-bold text-gray-900 text-center">Add Transaction</h2>
        <p className="text-gray-500 text-center mt-2">Track your expenses and income easily</p>

        <form className="mt-6" onSubmit={handleSubmit(onSubmitForm)}>
          {/* Transaction Type Selection */}
          <div className="flex justify-between mb-6">
            {["income", "expense"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTransactionType(type as "income" | "expense" )}
                className={`px-4 py-2 rounded-lg border ${
                  transactionType === type ? "bg-blue-600 text-white" : "border-blue-600 text-blue-600"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Input */}
            <div className="relative">
              <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
              <input
                type="date"
                defaultValue={date || today}
                disabled
                className="w-full pl-10 p-3 rounded-lg border bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Amount */}
            <div className="relative">
              <FaMoneyBill className="absolute top-3 left-3 text-gray-400" />
              <input
                type="number"
                {...register("amount", { valueAsNumber: true })}
                placeholder="Amount"
                className="w-full pl-10 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
            </div>

            {/* Account Selection */}
            <div className="relative">
              <FaWallet className="absolute top-3 left-3 text-gray-400" />
              <select
                {...register("account")}
                className="w-full pl-10 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Account</option>
                {accounts.map((account) => (
                  <option key={account} value={account}>
                    {account}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Selection */}
           {/* Category Selection */}
<div className="relative">
  <FaTag className="absolute top-3 left-3 text-gray-400" />
  <select
    {...register("category")}
    value={selectedCategory}
    onChange={(e) => handleCategorySelect(e.target.value)}
    className="w-full pl-10 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    <option value="">Select Category</option>
    {categories.map((category: { name: string }) => (
      <option key={category.name} value={category.name}>
        {category.name}
      </option>
    ))}
  </select>
  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
</div>


            {/* Note Input */}
            <div className="relative col-span-2">
              <FaStickyNote className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                {...register("note")}
                placeholder="Note"
                className="w-full pl-10 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.note && <p className="text-red-500 text-sm mt-1">{errors.note.message}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition"
          >
            Add Transaction
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default TransactionForm;
