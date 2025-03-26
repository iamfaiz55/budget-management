import React, { useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { PieChart } from "react-native-svg-charts";
import { G, Text as SvgText } from "react-native-svg";

// Generate Random Color for Each Category
const getRandomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

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
}

const ChartComponent: React.FC<ChartComponentProps> = ({ transactions }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const animatedScale = new Animated.Value(1);

  // Start animation on touch
  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(animatedScale, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(animatedScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  // Group transactions by category
  const groupedData = transactions.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = { amount: 0, color: getRandomColor() };
    acc[t.category].amount += Math.abs(t.amount);
    return acc;
  }, {} as { [key: string]: { amount: number; color: string } });

  // Calculate Total Amount
  const totalAmount = Object.values(groupedData).reduce((sum, val) => sum + val.amount, 0);

  // Format Data for Pie Chart
  const data = Object.keys(groupedData).map((category) => ({
    key: category,
    value: groupedData[category].amount,
    percentage: ((groupedData[category].amount / totalAmount) * 100).toFixed(1) + "%",
    svg: {
      fill: groupedData[category].color,
      onPress: () => handleSelect(category, groupedData[category].amount),
    },
  }));

  // Handle Category Selection
  const handleSelect = (category: string, amount: number) => {
    setSelectedCategory(category);
    setSelectedAmount(amount);
    startAnimation();
  };

  // Labels for Pie Chart
  const Labels = ({ slices }: { slices?: any[] }) => {
    if (!slices || slices.length === 0) return null; // Prevent error when slices are undefined

    return slices.map((slice, index) => {
      const { centroid, data } = slice;
      if (!centroid) return null; // Ensure centroid exists
      return (
        <G key={index}>
          <SvgText
            x={centroid[0]}
            y={centroid[1]}
            fill="white"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={14}
            fontWeight="bold"
          >
            {data.percentage}
          </SvgText>
        </G>
      );
    });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", paddingTop: 20 }}>
      {/* Animated Pie Chart */}
      {data.length > 0 ? (
        <Animated.View style={{ transform: [{ scale: animatedScale }] }}>
          <PieChart
            style={{ height: 300, width: 300 }}
            data={data}
            innerRadius={"50%"}
            outerRadius={"90%"}
          >
            <Labels slices={data.map((d, i) => ({ data: d, centroid: [0, 0] }))} />
          </PieChart>
        </Animated.View>
      ) : (
        <Text style={{ fontSize: 16, color: "gray", marginTop: 20 }}>No Data Available</Text>
      )}

      {/* Legend with Category Names & Colors */}
      <View style={{ marginTop: 20, width: "80%" }}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSelect(item.key, groupedData[item.key].amount)}
            style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: item.svg.fill,
                marginRight: 10,
                borderRadius: 5,
              }}
            />
            <Text style={{ fontSize: 16 }}>{item.key} ({item.percentage})</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Show Selected Category & Amount */}
      {selectedCategory && selectedAmount !== null && (
        <Text style={{ fontSize: 18, marginTop: 20, textAlign: "center" }}>
          Selected: {selectedCategory} - ${selectedAmount}
        </Text>
      )}
    </View>
  );
};

export default ChartComponent;
