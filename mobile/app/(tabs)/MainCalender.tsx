import { useGetAllTransactionsQuery } from "@/redux/transactionApi";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";

const screenHeight = Dimensions.get("window").height;

const CalendarScreen: React.FC = () => {
  const { data, refetch, isLoading } = useGetAllTransactionsQuery();
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [transactions, setTransactions] = useState<Record<string, { amount: number, type:string }[]>>({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (data) {
      const groupedTransactions: Record<string, { amount: number, type:string }[]> = {};
      const nonTransferTransactions = data.result.filter((transaction: any) => !transaction.isTransfered);

      nonTransferTransactions.forEach((transaction: any) => {
        const date = transaction.date;
        if (!groupedTransactions[date]) {
          groupedTransactions[date] = [];
        }
        groupedTransactions[date].push({ amount: transaction.amount, type: transaction.type });
      });
      
      setTransactions(groupedTransactions);
    }
  }, [data]);

  const formatDate = (date: Date): string => date.toISOString().split("T")[0];
  const todayDate: string = formatDate(new Date());

  const getTransactionSummary = (date: string): { total: number; hasIncome: boolean; hasExpense: boolean } => {
    if (!transactions[date]) return { total: 0, hasIncome: false, hasExpense: false };
  
    let income = 0, expense = 0;
    
    transactions[date].forEach((t) => {
      if (t.type === "income") {
        income += t.amount;
      } else if (t.type === "expense") {
        expense += t.amount;
      }
    });
  
    // console.log("Income:", income);
    // console.log("Expense:", expense);
  
    return { 
      total: income - expense,  
      hasIncome: income > 0, 
      hasExpense: expense > 0 
    };
  };
  

  const handleSwipe = (event: PanGestureHandlerGestureEvent) => {
    const { translationX } = event.nativeEvent;
    let newDate = new Date(selectedMonth);
    if (translationX < -50) newDate.setMonth(newDate.getMonth() + 1);
    else if (translationX > 50) newDate.setMonth(newDate.getMonth() - 1);
    setSelectedMonth(newDate);
  };

  const handleDayPress = (date: string) => {
    router.push({
      pathname: "/screens/AddTransaction",
      params: { date },
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions Calendar</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          {refreshing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.refreshButtonText}>Refresh</Text>
          )}
        </TouchableOpacity>
      </View>

      <PanGestureHandler onGestureEvent={handleSwipe}>
        <View style={styles.calendarContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#007BFF" />
          ) : (
            <Calendar
              style={styles.fullScreenCalendar}
              current={formatDate(selectedMonth)}
              onMonthChange={(month: DateData) => setSelectedMonth(new Date(month.year, month.month - 1, 1))}
              markingType={"custom"}
              dayComponent={({ date }: { date?: DateData }) => {
                if (!date) return null;
                const dateString = date.dateString;
                const { total, hasIncome, hasExpense } = getTransactionSummary(dateString);
                // console.log('total : ', total);
                
                const isToday = dateString === todayDate;
              
                const amountColor = total < 0 ? "red" : total > 0 ? "blue" : "black"; 

              
                return (
                  <TouchableOpacity onPress={() => handleDayPress(dateString)} style={styles.dayContainer}>
                    <Text style={[styles.dayText, isToday && styles.todayText]}>{date.day}</Text>
                    {total !== 0 && (
                      <View style={styles.transactionSummary}>
                        <Text style={[styles.transactionText, { color: amountColor }]}>
                          {total > 0 ? `+${total}` : `${total}`}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
              
              theme={{
                todayTextColor: "#007BFF",
                arrowColor: "#007BFF",
                selectedDayBackgroundColor: "#007BFF",
                selectedDayTextColor: "#ffffff",
                monthTextColor: "#2C3E50",
                textMonthFontSize: 18,
                textDayFontSize: 16,
              }}
            />
          )}
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#007BFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  refreshButton: {
    backgroundColor: "#0056b3",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  calendarContainer: {
    marginTop: 1,
  },
  fullScreenCalendar: {
    marginHorizontal: 6,
  },
  dayContainer: {
    height: screenHeight * 0.09,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    padding: 5,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "flex-end",
  },
  todayText: {
    color: "#007BFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  transactionSummary: {
    alignSelf: "flex-start",
    marginTop: 5,
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  transactionText: {
    fontSize: 10,
    fontWeight: "bold",
  },
});
