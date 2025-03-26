import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLazyTransactionByDateQuery } from "@/redux/transactionApi";

interface TransactionDateParams {
  fromDate: string;
  toDate: string;
}

const Total = () => {
  const [getData, { data, isLoading, isError, error }] = useLazyTransactionByDateQuery();
  
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  useEffect(() => {
    if (fromDate && toDate) {
      const params: TransactionDateParams = {
        fromDate: fromDate.toISOString().split("T")[0],
        toDate: toDate.toISOString().split("T")[0],
      };
      getData(params);
    }
  }, [fromDate, toDate]);

  const handleDateChange = (selectedDate: Date | undefined, type: "from" | "to") => {
    if (selectedDate) {
      if (type === "from") {
        setFromDate(selectedDate);
        setShowFromPicker(false);
      } else {
        setToDate(selectedDate);
        setShowToPicker(false);
      }
    }
  };

  // Process API response
  const transactions = data?.result || [];

  // Filter transactions by type
  const incomeTransactions = transactions.filter((t) => t.type === "income");
  const expenseTransactions = transactions.filter((t) => t.type === "expense");

  // Calculate total income and expense
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Total Summary</Text>

        {/* Date Picker Section */}
        <View style={styles.dateContainer}>
          <View style={styles.dateSection}>
            <Text style={styles.label}>From</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowFromPicker(true)}>
              <Text style={styles.dateText}>{fromDate ? fromDate.toDateString() : "Select Date"}</Text>
            </TouchableOpacity>
            {showFromPicker && (
              <DateTimePicker
                value={fromDate || new Date()}
                mode="date"
                display="calendar"
                onChange={(_, date) => handleDateChange(date, "from")}
              />
            )}
          </View>

          <View style={styles.dateSection}>
            <Text style={styles.label}>To</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowToPicker(true)}>
              <Text style={styles.dateText}>{toDate ? toDate.toDateString() : "Select Date"}</Text>
            </TouchableOpacity>
            {showToPicker && (
              <DateTimePicker
                value={toDate || new Date()}
                mode="date"
                display="calendar"
                onChange={(_, date) => handleDateChange(date, "to")}
              />
            )}
          </View>
        </View>

        {/* Income, Expense, and Total Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Income</Text>
            <Text style={styles.summaryAmount}>₹{totalIncome}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Expense</Text>
            <Text style={styles.summaryAmount}>₹{totalExpense}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Total</Text>
            <Text style={styles.summaryAmount}>₹{totalBalance}</Text>
          </View>
        </View>

        {/* Display API response */}
        {isLoading && <Text>Loading...</Text>}
        {isError && <Text style={{ color: "red" }}>Error: {error?.toString()}</Text>}

        {/* Transaction List */}
        {transactions.length > 0 && (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item._id?.toString() ?? Math.random().toString()}
            renderItem={({ item }) => (
              <View style={styles.transactionItem}>
                <Text style={styles.transactionText}>
                  {item.date} - {item.category} ({item.account})
                </Text>
                <Text style={[styles.transactionAmount, item.type === "income" ? styles.income : styles.expense]}>
                  ₹{item.amount}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default Total;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    marginTop: 10,
  },
  card: {
    width: "100%",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateSection: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  dateButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
  },
  summary: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "500",
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  transactionText: {
    fontSize: 14,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "600",
  },
  income: {
    color: "green",
  },
  expense: {
    color: "red",
  },
});
