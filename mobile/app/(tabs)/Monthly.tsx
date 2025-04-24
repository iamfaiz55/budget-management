import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useGetAllTransactionsQuery } from '@/redux/transactionApi';
import MonthTransaction from './MonthTransaction';

type ITransaction = {
  _id: string;
  note?: string;
  type: "income" | "expense";
  date: string;
  category: string;
  amount: number;
  account: string;
};

type MonthlySummary = {
  _id: string;
  month: string;
  type: string;
  expense: number;
  income: number;
  total: number;
};

const groupTransactionsByMonth = (transactions: ITransaction[]): MonthlySummary[] => {
  const grouped: Record<string, { expense: number; income: number }> = {};

  transactions.forEach(({ date, amount, type }) => {
    if (!date) return;
    const transactionDate = new Date(date);
    const monthName = transactionDate.toLocaleString("default", { month: "long" });

    if (!grouped[monthName]) {
      grouped[monthName] = { expense: 0, income: 0 };
    }

    if (type === "expense") {
      grouped[monthName].expense += Math.abs(amount);
    } else if (type === "income") {
      grouped[monthName].income += amount;
    }
  });

  return Object.keys(grouped).map((monthName, index) => ({
    _id: String(index),
    month: monthName,
    expense: grouped[monthName].expense,
    income: grouped[monthName].income,
    total: grouped[monthName].income - grouped[monthName].expense,
    type: "summary",
  }));
};

const Monthly = () => {
  const { data, refetch } = useGetAllTransactionsQuery();
  const transactions: ITransaction[] = data?.result
  ?.filter((tx) => !tx.isTransfered) // 💥 Exclude transfers
  .map((tx) => ({
    ...tx,
    _id: tx._id || crypto.randomUUID(),
    type: tx.type === "income" || tx.type === "expense" ? tx.type : "expense",
  })) || [];


  const monthlyData = groupTransactionsByMonth(transactions);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filteredTransactions = transactions.filter(({ date }) => {
    if (!selectedMonth) return false;
    const transactionDate = new Date(date);
    return transactionDate.toLocaleString("default", { month: "long" }) === selectedMonth;
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  if (selectedMonth) {
    return (
      <MonthTransaction
        filteredTransactions={filteredTransactions}
        setSelectedMonth={setSelectedMonth}
        selectedMonth={selectedMonth}
      />
    );
  }

  return (
    <FlatList
      data={monthlyData}
      keyExtractor={(item) => item._id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListHeaderComponent={
        <>
          {/* Summary Section */}
          <View style={styles.summaryContainer}>
            <View style={[styles.column, styles.incomeColumn]}>
              <Text style={styles.columnText}>
                Income{"\n"}${monthlyData.reduce((sum, m) => sum + m.income, 0)}
              </Text>
            </View>
            <View style={[styles.column, styles.expenseColumn]}>
              <Text style={styles.columnText}>
                Expense{"\n"}${monthlyData.reduce((sum, m) => sum + m.expense, 0)}
              </Text>
            </View>
            <View style={[styles.column, styles.totalColumn]}>
              <Text style={styles.columnText}>
                Total{"\n"}${monthlyData.reduce((sum, m) => sum + m.total, 0)}
              </Text>
            </View>
          </View>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.flex1]}>Month</Text>
            <Text style={[styles.headerText, styles.flex1]}>Expense</Text>
            <Text style={[styles.headerText, styles.flex1]}>Income</Text>
            <Text style={[styles.headerText, styles.flex1]}>Total</Text>
          </View>
        </>
      }
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => setSelectedMonth(item.month)}>
          <View style={styles.transactionRow}>
            <Text style={[styles.cell, styles.flex1]}>{item.month}</Text>
            <Text style={[styles.cell, styles.flex1, { color: "red" }]}>${item.expense}</Text>
            <Text style={[styles.cell, styles.flex1, { color: "green" }]}>${item.income}</Text>
            <Text style={[styles.cell, styles.flex1, { fontWeight: "bold" }]}>${item.total}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default Monthly;

const styles = StyleSheet.create({
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    padding: 10,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  incomeColumn: { backgroundColor: '#d4edda' },
  expenseColumn: { backgroundColor: '#f8d7da' },
  totalColumn: { backgroundColor: '#d1ecf1' },
  columnText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 5,
    marginBottom: 3,
  },
  cell: {
    fontSize: 16,
    textAlign: 'center',
  },
  flex1: {
    flex: 1,
  },
});
