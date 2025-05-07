// import React from "react";
import { useGetAllTransactionsQuery } from "../../redux/transactionApi";
import { ITransaction } from "../../models/transaction.interface";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import { ITransaction } from "../../types"; 

const Day = () => {
  const navigate = useNavigate()
  const { data } = useGetAllTransactionsQuery();
  // console.log("data :", data);
  
  const today = new Date().toISOString().split("T")[0]; 

  // Filter today's transactions safely
  const todayTransactions = data?.result?.filter((transaction: ITransaction) =>
    transaction.date === today && !transaction.isTransfered
  ) || [];
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Today's Transactions</h2>

      {todayTransactions.length === 0 ? (
        <p className="text-center text-gray-500">No transactions for today.</p>
      ) : (
        <ul className="space-y-4">
        {todayTransactions.map((transaction: ITransaction) => (
          <li
            key={transaction._id}
            className={`p-4 rounded-lg shadow-md ${
              transaction.type === "income"
                ? "bg-green-100 border-l-4 border-green-500"
                : "bg-red-100 border-l-4 border-red-500"
            }`}
          >
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">{transaction.category}</h3>
              <p
                className={`font-bold ${
                  transaction.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}${transaction.amount}
              </p>
            </div>
      
            <p className="text-sm text-gray-600">Account: {transaction.account}</p>
            <p className="text-sm text-gray-600">Note: {transaction.note || "No details"}</p>
      
            {/* ✅ Add this line to show user name */}
            <p className="text-sm text-gray-600">User: {transaction.user?.name || "Unknown User"}</p>
      
            <p className="text-xs text-gray-500 mt-1">
              Time:{" "}
              {transaction.createdAt
                ? new Date(transaction.createdAt).toLocaleTimeString()
                : "Unknown"}
            </p>
          </li>
        ))}
      </ul>
      
      )}
      <button
        onClick={() =>  navigate(`/user/form/${today}`)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all duration-300"
      >
        <FaPlus size={20} />
      </button>
    </div>
  );
};

export default Day;
