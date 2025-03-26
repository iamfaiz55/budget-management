import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native';
import React from 'react';
import ChartComponent from '../components/Chart';
import { useGetAllTransactionsQuery } from '@/redux/transactionApi';

// Define Transaction Type
interface Transaction {
  id: string;
  date: string;
  category: string;
  amount: number;
  account: string;
  type: "income" | "expense";
}

const Expense = () => {
  // Fetch transactions using the query
  const { data, isLoading, error } = useGetAllTransactionsQuery();

  // Handle loading and error states
  if (isLoading) {
    return <Text style={styles.message}>Loading transactions...</Text>;
  }

  if (error || !data || !Array.isArray(data.result)) {
    return <Text style={styles.message}>Failed to load transactions</Text>;
  }

  // Convert API response to match Transaction type
  const transactions: Transaction[] = data.result.map((item, index) => ({
    id: item._id ?? String(index), // Ensure 'id' is present
    date: item.date,
    category: item.category,
    amount: item.amount,
    account: item.account,
    type: item.type as "income" | "expense", // Explicitly cast type
  }));

  // Filter only expense transactions
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === "expense"
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Expense Overview</Text>

      {/* Expense Chart */}
      {expenseTransactions.length > 0 ? (
        <ChartComponent transactions={expenseTransactions} />
      ) : (
        <Text style={styles.message}>No expense transactions found</Text>
      )}

      {/* Transaction List */}
      <Text style={styles.subHeader}>Recent Expense Transactions</Text>

      <View style={styles.listContainer}>
        {expenseTransactions.length > 0 ? (
          <FlatList
            data={expenseTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View>
                  <Text style={styles.category}>{item.category}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
                <Text style={styles.amount}>-${Math.abs(item.amount)}</Text>
              </View>
            )}
            scrollEnabled={false} // Disable FlatList scroll, handled by ScrollView
          />
        ) : (
          <Text style={styles.message}>No expense transactions available</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Expense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa", // Light gray background
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#2c3e50", // Dark blue-gray
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: "#34495e",
  },
  message: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  listContainer: {
    marginBottom: 20, // Space at bottom
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Shadow for Android
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  category: {
    fontSize: 16,
    fontWeight: "semibold",
    color: "#e74c3c", // Red for expenses
  },
  date: {
    fontSize: 14,
    color: "#7f8c8d", // Gray for date
  },
  amount: {
    fontSize: 18,
    fontWeight: "semibold",
    color: "#e74c3c", // Red for expense
  },
});
