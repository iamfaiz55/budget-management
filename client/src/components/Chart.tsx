import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ITransaction } from "../models/transaction.interface";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartProps {
  transactions: ITransaction[];
}

const Chart: React.FC<ChartProps> = ({ transactions }) => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [viewType, setViewType] = useState<"category" | "month">("category");

  const filteredTransactions = transactions.filter((t) => {
    if (t.isTransfered) return false;
    const transactionDate = new Date(t.date);
    if (fromDate && transactionDate < fromDate) return false;
    if (toDate && transactionDate > toDate) return false;
    return true;
  });

  const groupedTotals: { [key: string]: { income: number; expense: number } } = {};

  filteredTransactions.forEach((t) => {
    const key =
      viewType === "month"
        ? new Date(t.date).toLocaleString("default", { month: "short", year: "numeric" })
        : t.category;

    if (!groupedTotals[key]) {
      groupedTotals[key] = { income: 0, expense: 0 };
    }

    if (t.type === "income") {
      groupedTotals[key].income += t.amount;
    } else {
      groupedTotals[key].expense += t.amount;
    }
  });

  const labels = Object.keys(groupedTotals);
  const incomeData = labels.map((key) => groupedTotals[key].income);
  const expenseData = labels.map((key) => groupedTotals[key].expense);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: viewType === "month" ? "Income vs Expense by Month" : "Income vs Expense by Category",
      },
    },
  };

  return (
    <div className="bg-white p-4 sm:p-6 shadow-lg rounded-lg w-full max-w-4xl mx-auto">
      <h2 className="text-lg sm:text-xl font-bold text-center mb-4">Transactions Chart</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
        {/* Date Pickers */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex flex-col">
            <label className="text-sm font-medium">From Date</label>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              className="border rounded p-2 w-full sm:w-40"
              placeholderText="Select From Date"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium">To Date</label>
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              className="border rounded p-2 w-full sm:w-40"
              placeholderText="Select To Date"
            />
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            className={`w-full sm:w-auto px-4 py-2 rounded text-sm ${
              viewType === "category" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setViewType("category")}
          >
            Category Wise
          </button>
          <button
            className={`w-full sm:w-auto px-4 py-2 rounded text-sm ${
              viewType === "month" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setViewType("month")}
          >
            Month Wise
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-[300px] sm:h-[400px]">
        {labels.length === 0 ? (
          <p className="text-center text-gray-500">No transaction data available.</p>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default Chart;
