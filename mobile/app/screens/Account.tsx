import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSignOutMutation } from "@/redux/authApi";


const Account = () => {
    const [selectedMonth, setSelectedMonth] = useState("March 2025");
    const router = useRouter()
const [logout, {isSuccess, }]= useSignOutMutation()
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
      console.log("user logout Success");
      
      router.replace("/authentication/Login")
     }
    }, [isSuccess]);


//     const x = async()=>{
// const y = await AsyncStorage.getItem("authToken")
// console.log("gettt", y);

//     }
  return <ScrollView>
    <View style={styles.container}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>johndoe@example.com</Text>
        </View>
      </View>

      <View style={styles.spendingSummaryCard}>
          {/* Date Picker */}
          <Text style={styles.sectionTitle}>Select Month:</Text>
          <Picker
            selectedValue={selectedMonth}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          >
            <Picker.Item label="March 2025" value="March 2025" />
            <Picker.Item label="February 2025" value="February 2025" />
            <Picker.Item label="January 2025" value="January 2025" />
          </Picker>

          {/* Spending Summary */}
          <Text style={styles.sectionTitle}>Spending Summary ({selectedMonth})</Text>
          <View style={styles.spendingList}>
            <SpendingItem label="Total Cash Spent" amount="$1,500.00" color="#DC3545" />
            <SpendingItem label="Total Card Spent" amount="$3,000.00" color="#28A745" />
            <SpendingItem label="Total Account Spent" amount="$4,500.00" color="#007AFF" />
          </View>
        </View>


      {/* Account Balance */}
     

      {/* Plan Card */}
      <View style={styles.planCard}>
        <Text style={styles.sectionTitle}>Active Plan</Text>
        <Text style={styles.planTitle}>Premium Plan</Text>
        <Text style={styles.planDetails}>Unlimited Transactions & Advanced Reports</Text>
        <Text style={styles.planPrice}>$9.99/month</Text>
        <TouchableOpacity style={styles.manageButton}>
          <Text style={styles.manageText}>Manage Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Options */}
      <View style={styles.optionsContainer}>
        <OptionItem icon="settings-outline" label="Settings" />
        <OptionItem icon="notifications-outline" label="Notifications" />
        <OptionItem icon="bar-chart-outline" label="Reports" />
        <OptionItem icon="help-circle-outline" label="Help & Support" />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={e=>logout()}>
        <Ionicons name="log-out-outline" size={22} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
};
export default Account;

// Reusable Option Component
const OptionItem = ({ icon, label }:{icon:keyof typeof Ionicons.glyphMap, label:string}) => (
  <TouchableOpacity style={styles.optionItem}>
    <Ionicons name={icon} size={22} color="#007AFF" />
    <Text style={styles.optionText}>{label}</Text>
    <MaterialIcons name="chevron-right" size={24} color="#888" />
  </TouchableOpacity>
);



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
  planCard: {
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  planDetails: {
    fontSize: 14,
    color: "#EEE",
    textAlign: "center",
    marginVertical: 5,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  manageButton: {
    backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  manageText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
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
  },
  spendingList: {
    marginTop: 10,
  },
});
