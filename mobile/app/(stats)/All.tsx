import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ChartComponent from "../components/Chart";

// Static transaction data for testing
const testTransactions = [
  { id: "1", date: "2024-03-21", category: "Food", amount: -20, account: "Cash", type: "expense" },
  { id: "2", date: "2024-03-20", category: "Salary", amount: 1000, account: "Bank", type: "income" },
  { id: "3", date: "2024-03-19", category: "Shopping", amount: -150, account: "Credit Card", type: "expense" },
  { id: "4", date: "2024-03-18", category: "Freelance", amount: 500, account: "Bank", type: "income" },
  { id: "5", date: "2024-03-17", category: "Rent", amount: -700, account: "Bank", type: "expense" },
  { id: "6", date: "2024-03-16", category: "Other", amount: -50, account: "Wallet", type: "expense" },
];

const All = () => {
  return (
    <View>
      {/* <ChartComponent transactions={testTransactions} /> */}
    </View>
  );
};

export default All;

const styles = StyleSheet.create({});
