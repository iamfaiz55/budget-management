import React, { useState } from "react";
import { useGetAllTransactionsQuery } from "../../redux/transactionApi";

type Transaction = {
  date: string;
  amount: number;
  type: "income" | "expense";
};

type MonthlySummary = {
  id: string;
  month: string;
  expense: number;
  income: number;
  total: number;
  transactions: Transaction[];
};

const groupTransactionsByMonth = (transactions: Transaction[]): MonthlySummary[] => {
  const grouped: Record<string, { expense: number; income: number; transactions: Transaction[] }> = {};

  transactions.forEach(({ date, amount, type }) => {
    if (!date) return;
    const transactionDate = new Date(date);
    const monthName = transactionDate.toLocaleString("default", { month: "long" });

    if (!grouped[monthName]) {
      grouped[monthName] = { expense: 0, income: 0, transactions: [] };
    }

    grouped[monthName].transactions.push({ date, amount, type });

    if (type === "expense") {
      grouped[monthName].expense += Math.abs(amount);
    } else if (type === "income") {
      grouped[monthName].income += amount;
    }
  });

  return Object.keys(grouped).map((monthName, index) => ({
    id: String(index),
    month: monthName,
    expense: grouped[monthName].expense,
    income: grouped[monthName].income,
    total: grouped[monthName].income - grouped[monthName].expense,
    transactions: grouped[monthName].transactions,
  }));
};

const MonthlyTransactions: React.FC = () => {
  const { data } = useGetAllTransactionsQuery();
  const transactions: Transaction[] = data?.result
  ?.filter((tx: any) => !tx.isTransfered) // ✅ filter out transfers
  .map((tx: any) => ({
    date: tx.date,
    amount: tx.amount,
    type: tx.type === "income" || tx.type === "expense" ? tx.type : "expense", 
  })) || [];

    const monthlyData: MonthlySummary[] = groupTransactionsByMonth(transactions);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const handleMonthClick = (month: string) => {
    setSelectedMonth(month === selectedMonth ? null : month);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Monthly Transactions</h1>

      <div className="flex justify-between bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <div className="text-green-600 font-semibold">Income: ${monthlyData.reduce((sum, m) => sum + m.income, 0)}</div>
        <div className="text-red-600 font-semibold">Expense: ${monthlyData.reduce((sum, m) => sum + m.expense, 0)}</div>
        <div className="font-bold">Total: ${monthlyData.reduce((sum, m) => sum + m.total, 0)}</div>
      </div>

      <ul className="space-y-4">
        {monthlyData.map((item) => (
          <li
            key={item.id}
            className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500 cursor-pointer"
            onClick={() => handleMonthClick(item.month)}
          >
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">{item.month}</div>
              <div className="text-red-600 font-medium">Expense: ${item.expense}</div>
              <div className="text-green-600 font-medium">Income: ${item.income}</div>
              <div className="font-bold">Total: ${item.total}</div>
            </div>
            {selectedMonth === item.month && (
              <ul className="mt-4 border-t pt-2 space-y-2">
                {item.transactions.map((tx, index) => (
                  <li key={index} className="flex justify-between p-2 bg-gray-50 rounded-md">
                    <span>{new Date(tx.date).toLocaleDateString()}</span>
                    <span className={tx.type === "income" ? "text-green-600" : "text-red-600"}>${tx.amount}</span>
                    <span className="capitalize">{tx.type}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonthlyTransactions;
