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
    const monthName = transactionDate.toLocaleString("default", { month: "long", year: "numeric" });

    if (!grouped[monthName]) {
      grouped[monthName] = { expense: 0, income: 0, transactions: [] };
    }

    grouped[monthName].transactions.push({ date, amount, type });

    if (type === "expense") {
      grouped[monthName].expense += Math.abs(amount);
    } else {
      grouped[monthName].income += amount;
    }
  });

  return Object.entries(grouped).map(([month, data], index) => ({
    id: String(index),
    month,
    expense: data.expense,
    income: data.income,
    total: data.income - data.expense,
    transactions: data.transactions,
  }));
};

const MonthlyTransactions: React.FC = () => {
  const { data } = useGetAllTransactionsQuery();
  const transactions: Transaction[] = data?.result
    ?.filter((tx: any) => !tx.isTransfered)
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
    <div className="container mx-auto p-4 pb-14 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
        Monthly Transactions
      </h1>

      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 bg-gray-100 p-4 rounded-lg shadow mb-6 text-sm sm:text-base">
        <div className="text-green-600 font-semibold">Income: ${monthlyData.reduce((sum, m) => sum + m.income, 0)}</div>
        <div className="text-red-600 font-semibold">Expense: ${monthlyData.reduce((sum, m) => sum + m.expense, 0)}</div>
        <div className="font-bold">Total: ${monthlyData.reduce((sum, m) => sum + m.total, 0)}</div>
      </div>

      <ul className="space-y-4">
        {monthlyData.map((item) => (
          <li
            key={item.id}
            className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500"
          >
            <button
              onClick={() => handleMonthClick(item.month)}
              className="w-full text-left focus:outline-none"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:items-center">
                <div className="text-base font-semibold">{item.month}</div>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-sm sm:text-base">
                  <span className="text-red-600 font-medium">Expense: ${item.expense}</span>
                  <span className="text-green-600 font-medium">Income: ${item.income}</span>
                  <span className="font-bold">Total: ${item.total}</span>
                </div>
              </div>
            </button>

            {selectedMonth === item.month && (
              <ul className="mt-4 border-t pt-2 space-y-2 text-sm">
                {item.transactions.map((tx, index) => (
                  <li
                    key={index}
                    className="flex flex-col sm:flex-row sm:justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <span>{new Date(tx.date).toLocaleDateString()}</span>
                    <span className={tx.type === "income" ? "text-green-600" : "text-red-600"}>
                      ${tx.amount}
                    </span>
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
