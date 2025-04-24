import React, { useState, useEffect } from "react";
import { useLazyTransactionByDateQuery } from "../../redux/transactionApi";
import { ITransaction } from "../../models/transaction.interface";

const Total: React.FC = () => {
  const [getData, { data, isLoading, isError, error }] = useLazyTransactionByDateQuery();
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  useEffect(() => {
    if (fromDate && toDate) {
      getData({ fromDate, toDate });
    }
  }, [fromDate, toDate, getData]);

  // Transactions
  const transactions: ITransaction[] = data?.result || [];
  const filteredTransactions = transactions.filter((t) => !t.isTransfered);

  // Filter income & expenses
  const incomeTransactions = filteredTransactions.filter((t) => t.type === "income");
  const expenseTransactions = filteredTransactions.filter((t) => t.type === "expense");
  
  // Calculate totals
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Total Summary</h2>

        {/* Date Pickers */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={fromDate || ""}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={toDate || ""}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 text-center my-6">
          <div className="bg-green-100 text-green-600 p-4 rounded-lg">
            <p className="text-lg font-semibold">Income</p>
            <p className="text-xl font-bold">₹{totalIncome}</p>
          </div>
          <div className="bg-red-100 text-red-600 p-4 rounded-lg">
            <p className="text-lg font-semibold">Expense</p>
            <p className="text-xl font-bold">₹{totalExpense}</p>
          </div>
          <div className={`p-4 rounded-lg ${totalBalance >= 0 ? "bg-blue-100 text-blue-600" : "bg-red-200 text-red-700"}`}>
            <p className="text-lg font-semibold">Total</p>
            <p className="text-xl font-bold">₹{totalBalance}</p>
          </div>
        </div>

        {/* Loading & Error States */}
        {isLoading && <p className="text-center text-gray-500">Loading...</p>}
        {isError && <p className="text-center text-red-500">Error: {error?.toString()}</p>}

        {/* Transaction List */}
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Category</th>
                  <th className="border border-gray-300 px-4 py-2">Account</th>
                  <th className="border border-gray-300 px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{transaction.date}</td>
                    <td className="border border-gray-300 px-4 py-2">{transaction.category}</td>
                    <td className="border border-gray-300 px-4 py-2">{transaction.account}</td>
                    <td
                      className={`border border-gray-300 px-4 py-2 font-bold ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ₹{transaction.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default Total;
