import React, { useState } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit"; // Correct import

// Define Transaction Interface
interface Transaction {
  id: string;
  date: string;
  category: string;
  amount: number;
  account: string;
  type: "income" | "expense";
}

// Define Component Props
interface ChartComponentProps {
  transactions: Transaction[];
  onDataReady?: (summary: {
    total: number;
    topCategory: string;
    topAmount: number;
    chartData: {
      name: string;
      amount: number;
      color: string;
    }[];
  }) => void;
}


// Screen Width for Chart Sizing
const screenWidth = Dimensions.get("window").width;

const ChartComponent: React.FC<ChartComponentProps> = ({ transactions, onDataReady }) => {
  // Group transactions by category
  const groupedData = transactions.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = { amount: 0, color: getRandomColor() };
    acc[t.category].amount += Math.abs(t.amount);
    return acc;
  }, {} as { [key: string]: { amount: number; color: string } });
// Send summary to parent


  const chartData = Object.keys(groupedData).map((category) => ({
    name: category,
    amount: groupedData[category].amount,
    color: groupedData[category].color,
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));

if (chartData.length > 0 && onDataReady) {
  const sorted = [...chartData].sort((a, b) => b.amount - a.amount);
  onDataReady({
    total: sorted.reduce((sum, item) => sum + item.amount, 0),
    topCategory: sorted[0].name,
    topAmount: sorted[0].amount,
    chartData: chartData,
  });
}
  return (
    <View style={styles.container}>
      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={screenWidth}
          height={220}
          accessor={"amount"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          center={[10, 0]}
          absolute
          chartConfig={{
            color: () => "#fff",
            labelColor: () => "#000",
          }}
          hasLegend={true}
        />
      ) : (
        <Text style={styles.noDataText}>No Data Available</Text>
      )}

    

    </View>
  );
};

// Random color generator
const getRandomColor = () => {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center", // Centers the content vertically and horizontally
    paddingTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "gray",
    marginTop: 20,
    textAlign: "center", // Ensures the text is centered horizontally
  },
  selectedCategoryText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
    paddingHorizontal: 20,     // Add horizontal padding
    flexWrap: "wrap",          // Allow text to wrap
    maxWidth: "100%",          // Prevent overflow
  },
  
});

export default ChartComponent;
