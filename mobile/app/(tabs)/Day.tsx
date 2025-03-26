import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetAllTransactionsQuery } from '@/redux/transactionApi';

const Day = () => {
  const { data, refetch, isLoading } = useGetAllTransactionsQuery();
  const router = useRouter();

  const today = new Date().toISOString().split('T')[0];
  const transactions = data?.result?.filter(t => t.date === today) || [];

  const calculateTotal = (type: string) => {
    if (type === 'income') {
      return transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    } else if (type === 'expense') {
      return transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    } else {
      return transactions.reduce((sum, t) => sum + t.amount, 0);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        router.replace("/authentication/Login");
      }
    };
    checkAuth();
  }, []);

  const handleRefresh =  () => {
     refetch();
  };

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={[styles.column, styles.incomeColumn]}>
          <Text style={styles.columnText}>Income{"\n"}${calculateTotal('income')}</Text>
        </View>
        <View style={[styles.column, styles.expenseColumn]}>
          <Text style={styles.columnText}>Expense{"\n"}${calculateTotal('expense')}</Text>
        </View>
        <View style={[styles.column, styles.totalColumn]}>
          <Text style={styles.columnText}>Total{"\n"}${calculateTotal('total')}</Text>
        </View>
      </View>

      <View style={styles.transactionList}>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id?.toString() ?? Math.random().toString()}
          renderItem={({ item }) => (
            <View style={[styles.transactionItem, item.type === 'income' ? styles.incomeItem : styles.expenseItem]}>
              <Text style={styles.category}>{item.category}</Text>
              <View style={styles.noteContainer}>
                <Text style={styles.note}>{item.note}</Text>
                <Text style={styles.account}>{item.account}</Text>
              </View>
              <Text style={[styles.amount, item.type === 'income' ? styles.incomeText : styles.expenseText]}>
                {item.type === 'income' ? `+ $${item.amount}` : `- $${item.amount}`}
              </Text>
            </View>
          )}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/screens/AddTransaction") }>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Day;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
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
    fontWeight: 'light',
    textAlign: 'center',
  },
  transactionList: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  incomeItem: { backgroundColor: '#e6f9e6' },
  expenseItem: { backgroundColor: '#fde8e8' },
  category: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'medium',
    color: '#333',
  },
  noteContainer: {
    flex: 2,
  },
  note: {
    fontSize: 16,
  },
  account: {
    fontSize: 14,
    color: '#888',
  },
  amount: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
  },
  incomeText: {
    color: 'blue',
  },
  expenseText: {
    color: 'red',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    backgroundColor: '#007bff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 2 },
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
  },
});
