import { StyleSheet, Text, TouchableOpacity, View, FlatList, RefreshControl } from 'react-native';
import React, { useState, useCallback } from 'react';

// ✅ Define TypeScript Props
type Transaction = {
  _id: string;
  category: string;
  account: string;
  date: string;
  amount: number;
  type: "income" | "expense";
};

type Props = {
  filteredTransactions: Transaction[];
  setSelectedMonth: React.Dispatch<React.SetStateAction<string | null>>;
  selectedMonth: string | null;
};

const MonthTransaction: React.FC<Props> = ({ filteredTransactions, setSelectedMonth, selectedMonth }) => {
  const [refreshing, setRefreshing] = useState(false);

  // Simulate a refresh action
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500); // Simulated refresh delay
  }, []);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => setSelectedMonth(null)} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Transactions for {selectedMonth}</Text>

      {/* Transactions List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found</Text>}
        renderItem={({ item }) => {
          const formattedDate = new Date(item.date).toLocaleDateString("default", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });

          return (
            <View style={styles.transactionRow}>
              {/* Left Section (Category, Account, Date) */}
              <View style={styles.transactionDetails}>
                <Text style={styles.categoryText}>{item.category}</Text>
                <Text style={styles.accountText}>{item.account}</Text>
                <Text style={styles.dateText}>{formattedDate}</Text>
              </View>

              {/* Right Section (Amount & Type) */}
              <View>
                <Text style={[styles.amountText, item.type === "income" ? styles.incomeText : styles.expenseText]}>
                  {item.type === "income" ? "+" : "-"}${item.amount.toFixed(2)}
                </Text>
                <Text style={styles.transactionType}>{item.type.toUpperCase()}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default MonthTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  backButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    marginBottom: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 5,
    marginBottom: 3,
    alignItems: "center",
  },
  transactionDetails: {
    flex: 1,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  accountText: {
    fontSize: 14,
    color: "#777",
  },
  dateText: {
    fontSize: 13,
    color: "#999",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  incomeText: {
    color: "green",
  },
  expenseText: {
    color: "red",
  },
  transactionType: {
    fontSize: 14,
    textAlign: "right",
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});
