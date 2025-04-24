import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSignOutMutation } from "@/redux/authApi";
import {  useGetMyPlanQuery } from "@/redux/subscriptionApi";
import { IUser } from "@/models/user.interface";
import { useGetAllTransactionsQuery } from "@/redux/transactionApi";
import { RefreshControl } from "react-native-gesture-handler";
// import { useGetAllTransactionsQuery } from "@/redux/transactionApi";
// import { useGetAllTransactionsQuery } from "@/redux/transactionApi";

const Account = () => {
  // const {data:AllTransaction, {isSuccess:allTransactionGetSuccess}}= useGetAllTransactionsQuery()
   const [myData, setMyData] = useState<{name:string, email:string}| null>();
   const { data: myPlan, isLoading: loadingPlan, error } = useGetMyPlanQuery();
   const router = useRouter()
   const [logout, {isSuccess, }]= useSignOutMutation()
// console.log("my plan error :", error);

   const {data:allTransactions, refetch,isLoading}= useGetAllTransactionsQuery()
   useEffect(() => {
      const checkAuth = async () => {
         const token = await AsyncStorage.getItem("authToken");
             if (!token) {
                  router.replace("/authentication/Login");
             }
       };
       checkAuth();
   
       
  }, []);

  useEffect(() => {
      
     if(isSuccess){
      // console.log("user logout Success");
      
      router.replace("/authentication/Login")
     }
    }, [isSuccess]);


    
    useEffect(() => {
      const fetchUser = async () => {
        const userString = await AsyncStorage.getItem("user");
  
        if (userString) {
          const userData: IUser = JSON.parse(userString);
          setMyData(userData);
        } else {
          console.warn("No user data found in AsyncStorage.");
        }
      };
    
      fetchUser();
    }, []);
    
  return <ScrollView     refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}>
    <View style={styles.container}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        {/* <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.avatar} /> */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{myData && myData.name}</Text>
          <Text style={styles.userEmail}>{myData && myData.email}</Text>
        </View>
      </View>

      <View style={styles.spendingSummaryCard}>
         

          {/* Spending Summary */}
          <View style={styles.spendingList}>
            <SpendingItem
  label="Available Balance"
  amount={`$${(allTransactions?.balance ?? 0) > 0 ? allTransactions?.balance : "0"}`}
  color="#007AFF"
/>
          </View>
        </View>


      {/* Account Balance */}
     

      {/* Plan Card */}
      {loadingPlan ? (
  <Text>Loading...</Text>
) : myPlan?.result?.isActive ? (
  <>
    <Text style={styles.planActiveTitle}>🎉 Active Plan</Text>
    <View style={styles.planInfoBox}>
      <Text style={styles.planName}>{myPlan.result.plan.name}</Text>

      <View style={styles.planRow}>
        <Text style={styles.planLabel}>💰 Price:</Text>
        <Text style={styles.planValue}>₹{myPlan.result.plan.price}</Text>
      </View>

      <View style={styles.planRow}>
        <Text style={styles.planLabel}>📅 Duration:</Text>
        <Text style={styles.planValue}>{myPlan.result.plan.duration} Days</Text>
      </View>

      <View style={styles.planRow}>
        <Text style={styles.planLabel}>⏳ Start:</Text>
        <Text style={styles.planValue}>
          {new Date(myPlan.result.startDate).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.planRow}>
        <Text style={styles.planLabel}>🚀 Ends:</Text>
        <Text style={styles.planValue}>
          {new Date(myPlan.result.endDate).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.daysLeftBox}>
        <Text style={styles.daysLeftText}>
          🕐{" "}
          {Math.max(
            0,
            Math.ceil(
              (new Date(myPlan.result.endDate).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            )
          )}{" "}
          Days Left
        </Text>
      </View>

      <TouchableOpacity style={styles.manageButton}>
        <Text style={styles.manageText}>Manage Plan</Text>
      </TouchableOpacity>
    </View>
  </>
) : <></>}

    <View style={styles.noPlanCard}>
        <Text style={styles.noPlanText}>You don’t have an active plan.</Text>
        <TouchableOpacity
          style={styles.goToPlansButton}
          onPress={() => router.push("/configurations/Plans")
    }
        >
          <Text style={styles.goToPlansText}>🔓 View Available Plans</Text>
        </TouchableOpacity>
      </View>
    
    
          {/* Settings Options */}
      <View style={styles.optionsContainer}>

    
      <TouchableOpacity style={styles.optionItem} onPress={() => router.push("/configurations/Family")}>
          <Ionicons name="people-outline" size={22} color="#007AFF" />
          <Text style={styles.optionText}>Family</Text>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
    
    
      <TouchableOpacity style={styles.optionItem} >
          <Ionicons name="notifications-outline" size={22} color="#007AFF" />
          <Text style={styles.optionText}>Notifications</Text>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
    
  
      <TouchableOpacity style={styles.optionItem} >
          <Ionicons name="help-circle-outline" size={22} color="#007AFF" />
          <Text style={styles.optionText}>Help & Support</Text>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
    </View>



      <TouchableOpacity style={styles.logoutButton} onPress={e=>logout()}>
        <Ionicons name="log-out-outline" size={22} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
};
export default Account;





const SpendingItem = ({ label, amount, color }:{label:string, amount:string, color:string}) => (
    <View style={styles.spendingItem}>
      <Text style={styles.spendingLabel}>{label}</Text>
      <Text style={[styles.spendingAmount, { color }]}>{amount}</Text>
    </View>
  );
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F5",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  balanceCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 10,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceItem: {
    alignItems: "center",
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#777",
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  income: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28A745",
  },
  expense: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#DC3545",
  },
  planActiveTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 10,
  },
  
  planInfoBox: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  
  planName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007AFF",
    textAlign: "center",
    marginBottom: 10,
  },
  
  planRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  
  planLabel: {
    fontSize: 14,
    color: "#666",
  },
  
  planValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  
  daysLeftBox: {
    marginTop: 12,
    backgroundColor: "#E6F0FF", // subtle blue background
    borderRadius: 10,
    paddingVertical: 10,
  },
  
  daysLeftText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  
  manageButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  
  manageText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  
  optionsContainer: {
    marginTop: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: "row",
    // alignItems: "center",
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 30,
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  dateFilter: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
  },
  picker: {
    marginTop: 5,
  },
 
  spendingCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  spendingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  spendingLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  spendingAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  spendingSummaryCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBlock:15
  },
  spendingList: {
    marginTop: 10,
  },
  noPlanCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  
  noPlanText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
    textAlign: "center",
  },
  
  goToPlansButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  
  goToPlansText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
