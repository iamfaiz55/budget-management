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

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartProps {
  transactions: ITransaction[];
}

const Chart: React.FC<ChartProps> = ({ transactions }) => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [viewType, setViewType] = useState<"category" | "month">("category");

// Filter transactions by date range and remove transfers
const filteredTransactions = transactions.filter((t) => {
  if (t.isTransfered) return false; // ✅ Skip transfers
  const transactionDate = new Date(t.date);
  if (fromDate && transactionDate < fromDate) return false;
  if (toDate && transactionDate > toDate) return false;
  return true;
});


  // Aggregate transactions based on the selected view
  const groupedTotals: { [key: string]: { income: number; expense: number } } = {};

  filteredTransactions.forEach((t) => {
    const key = viewType === "month" 
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

  // Labels & Data
  const labels = Object.keys(groupedTotals);
  const incomeData = labels.map((key) => groupedTotals[key].income);
  const expenseData = labels.map((key) => groupedTotals[key].expense);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "rgba(34, 197, 94, 0.6)", // Green
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "rgba(239, 68, 68, 0.6)", // Red
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: viewType === "month" ? "Income vs Expense by Month" : "Income vs Expense by Category" },
    },
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-lg font-bold text-center mb-4">Transactions Chart</h2>

      {/* Date Filters */}
      <div className="flex justify-between items-center mb-4">
  {/* Left Side - Date Pickers */}
  <div className="flex items-center space-x-4">
    <div className="flex flex-col">
      <label className="text-sm font-medium">From Date</label>
      <DatePicker
        selected={fromDate}
        onChange={(date) => setFromDate(date)}
        className="border rounded p-2 w-40"
        placeholderText="Select From Date"
      />
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-medium">To Date</label>
      <DatePicker
        selected={toDate}
        onChange={(date) => setToDate(date)}
        className="border rounded p-2 w-40"
        placeholderText="Select To Date"
      />
    </div>
  </div>

  {/* Right Side - Toggle Buttons */}
  <div className="flex space-x-4">
    <button
      className={`px-4 py-2 rounded ${viewType === "category" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
      onClick={() => setViewType("category")}
    >
      Category Wise
    </button>
    <button
      className={`px-4 py-2 rounded ${viewType === "month" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
      onClick={() => setViewType("month")}
    >
      Month Wise
    </button>
  </div>
</div>


      {/* Chart */}
      {labels.length === 0 ? (
        <p className="text-center text-gray-500">No transaction data available.</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default Chart;
