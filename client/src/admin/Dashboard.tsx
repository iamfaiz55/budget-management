import React, { useState } from "react";
import {
  Pie,
  Bar,
  Doughnut,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useGetAllPremiumMembersQuery } from "../redux/subscriptionApi";
import { useGetAllUsersQuery } from "../redux/userApi";
import { useGetAllPlansQuery } from "../redux/planApi";
import dayjs from "dayjs";


ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const { data: premiumUsers } = useGetAllPremiumMembersQuery();
  const { data: users } = useGetAllUsersQuery({ searchQuery: "", isFetchAll: true });
  const { data: plans } = useGetAllPlansQuery();

  const allUsers = users?.result || [];
  const allPremium = premiumUsers?.result || [];
  const allPlans = plans?.result || [];

  // Filter data by selected month
  const filteredPremiumMembers = allPremium.filter((member:any) => {
    console.log("memberrr", member);
    
    if (selectedMonth === "all") return true;
    return dayjs(member.createdAt).format("YYYY-MM") === selectedMonth;
  });

  const premiumPercent = (filteredPremiumMembers.length / allUsers.length) * 100 || 0;

  const planCounts: Record<string, number> = {};
  filteredPremiumMembers.forEach((member:any) => {
    const planName = member.plan?.name;
    if (planName) {
      planCounts[planName] = (planCounts[planName] || 0) + 1;
    }
  });

  const mostUsedPlan = Object.entries(planCounts).sort((a, b) => b[1] - a[1])?.[0]?.[0] || "N/A";

  const totalRevenue = Object.entries(planCounts).reduce((acc, [planName, count]) => {
    const planPrice = allPlans.find(p => p.name === planName)?.price || 0;
    return acc + planPrice * count;
  }, 0);

  const avgRevenuePerUser = totalRevenue / (filteredPremiumMembers.length || 1);

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">📊 Dashboard Overview</h1>

      {/* Filter Controls */}
      <div className="bg-gray-50 border p-4 rounded shadow text-sm flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">📅 Filter by Month</h2>
        </div>
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Time</option>
          {[...Array(6)].map((_, i) => {
            const month = dayjs().subtract(i, "month").format("YYYY-MM");
            return <option key={month} value={month}>{dayjs(month).format("MMMM YYYY")}</option>;
          })}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card label="Total Users" value={allUsers.length} color="text-blue-600" />
        <Card
          label="Premium Users"
          value={`${filteredPremiumMembers.length} (${premiumPercent.toFixed(1)}%)`}
          color="text-green-600"
        />
        <Card label="Revenue" value={`₹${totalRevenue.toFixed(2)}`} color="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <Card label="Total Plans" value={allPlans.length} />
        <Card label="Most Purchased Plan" value={mostUsedPlan} />
        <Card label="Avg. Revenue/User" value={`₹${avgRevenuePerUser.toFixed(2)}`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <ChartCard title="Premium vs Free Users">
          <Pie
            data={{
              labels: ["Premium", "Free"],
              datasets: [
                {
                  data: [filteredPremiumMembers.length, allUsers.length - filteredPremiumMembers.length],
                  backgroundColor: ["#10B981", "#F87171"],
                },
              ],
            }}
          />
        </ChartCard>

        <ChartCard title="Plan Usage">
          <Bar
            data={{
              labels: Object.keys(planCounts),
              datasets: [
                {
                  label: "Times Purchased",
                  data: Object.values(planCounts),
                  backgroundColor: "#3B82F6",
                },
              ],
            }}
          />
        </ChartCard>

        <ChartCard title="Revenue by Plan">
          <Doughnut
            data={{
              labels: Object.keys(planCounts),
              datasets: [
                {
                  label: "Revenue ₹",
                  data: Object.entries(planCounts).map(([planName]) => {
                    const planPrice = allPlans.find(p => p.name === planName)?.price || 0;
                    return planCounts[planName] * planPrice;
                  }),
                  backgroundColor: ["#8B5CF6", "#F59E0B", "#10B981"],
                },
              ],
            }}
          />
        </ChartCard>
      </div>

      {/* Highlights */}
      <div className="mt-10 bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-bold mb-4">✨ Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
          <Highlight icon="📈" title="User Growth" value="+12% this month (static)" />
          <Highlight icon="👑" title="Top Plan" value={`${mostUsedPlan}`} />
          <Highlight icon="💰" title="Revenue" value={`↑ ₹${totalRevenue.toFixed(2)} this month`} />
          <Highlight icon="📊" title="Avg Revenue/User" value={`₹${avgRevenuePerUser.toFixed(2)}`} />
          <Highlight icon="🧠" title="Premium Conversion" value={`${premiumPercent.toFixed(1)}%`} />
        </div>
      </div>
    </div>
  );
};

// Card Component
const Card = ({ label, value, color = "text-gray-800" }: { label: string; value: string | number; color?: string }) => (
  <div className="bg-white p-6 shadow rounded-lg text-center hover:shadow-md transition">
    <h2 className="text-sm text-gray-500">{label}</h2>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

// ChartCard Wrapper
const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="font-semibold mb-2">{title}</h2>
    {children}
  </div>
);

// Highlight Block
const Highlight = ({ icon, title, value }: { icon: string; title: string; value: string }) => (
  <div className="flex items-center space-x-4">
    <span className="text-xl">{icon}</span>
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-xs">{value}</p>
    </div>
  </div>
);

export default Dashboard;
