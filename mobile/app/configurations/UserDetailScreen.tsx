import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useUserStore } from "@/redux/userStore";
import Toast from "react-native-toast-message";
import { useAddAmountToMemberMutation } from "@/redux/transactionApi";
import { ArrowLeft } from "lucide-react-native";

const UserAccountScreen = () => {
  const router = useRouter();
  const [addAmountTomember, { isSuccess: amountAddedSuccess, isError, error }] =
    useAddAmountToMemberMutation();
    const [modalError, setModalError] = useState("");

  const { currentUser, transactions, adminBalance } = useUserStore();

  const [amount, setAmount] = useState("");
  const [accountType, setAccountType] = useState("Cash");
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const formattedDate = date.toISOString().split("T")[0];
  const totalBalance = transactions.reduce((acc, txn) => acc + txn.amount, 0);

  const handleSendAmount = (amount: number, date: Date, account: string) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      const errorMsg = "Please enter a valid number greater than 0.";
      setModalError(errorMsg); // <== Set modal error
      Toast.show({
        type: "error",
        text1: "Invalid Amount",
        text2: errorMsg,
        position: "bottom",
      });
      return;
    }
  
    setModalError(""); // Clear error on valid input
  
    if (currentUser && currentUser._id) {
      const formatted = date.toISOString().split("T")[0];
      addAmountTomember({
        memberId: currentUser._id,
        amount,
        date: formatted,
        account,
      });
    }
  };
  
  useEffect(() => {
    if (isError && error) {
      setModalError(error as string)
      Toast.show({
        type: "error",
        text1: "Transaction Failed",
        text2: error as string,
        position: "bottom",
      });
    }
    if (amountAddedSuccess) {
      Toast.show({
        type: "success",
        text1: "Transaction Success",
        position: "bottom",
      });
      setAmount("");
      setModalVisible(false);
      router.back();
    }
  }, [isError, amountAddedSuccess]);

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#000" />
          <Text style={{ marginLeft: 6, fontSize: 16 }}>Back</Text>
        </TouchableOpacity>

        {/* User Info */}
        <View style={styles.card}>
          <Text style={styles.title}  >{currentUser?.name}</Text>
          <Text style={styles.subDetail}>Email</Text>
          <Text style={styles.detail}>{currentUser?.email}</Text>
          <Text style={styles.subDetail}>Mobile</Text>
          <Text style={styles.detail}>{currentUser?.mobile}</Text>
        </View>

        {/* Transactions */}
        <Text style={styles.section}>Transactions</Text>
        {transactions.length ? (
          transactions.map((txn, i) => (
            <View key={i} style={styles.transactionCard}>
              <View>
                <Text style={styles.transactionCategory}>{txn.category}</Text>
                <Text style={styles.transactionDate}>{txn.date}</Text>
              </View>
              <Text style={styles.transactionAmount}>₹{txn.amount}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.detail}>No transactions found.</Text>
        )}

        {/* Balances */}
        <View style={styles.card}>
          <Text style={styles.balance}>User Balance: ₹{totalBalance.toFixed(2)}</Text>
          <Text style={styles.balance}>Admin Balance: ₹{adminBalance.toFixed(2)}</Text>
        </View>

        {/* Add Amount Button */}
        <TouchableOpacity
          style={styles.addAmountButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>+ Add Amount</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalError("");
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Add Amount</Text>
              {modalError ? (
          <Text style={{ color: "red", marginBottom: 8, textAlign: "center", fontSize:16 }}>
            {modalError}
          </Text>
        ) : null}
              <Text style={styles.modalLabel}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />

              <Text style={styles.modalLabel}>Date</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{formattedDate}</Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(e, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}

              <Text style={styles.modalLabel}>Account Type</Text>
              <View style={styles.accountTypeWrapper}>
                {["Cash", "Card", "Account"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setAccountType(type)}
                    style={[
                      styles.accountTypeButton,
                      accountType === type && { backgroundColor: "#2563eb" },
                    ]}
                  >
                    <Text style={{ color: accountType === type ? "#fff" : "#000" }}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Balances in Modal */}
              <View style={{ marginTop: 16 }}>
                <Text style={styles.balance}>User Balance: ₹{totalBalance.toFixed(2)}</Text>
                <Text style={styles.balance}>Admin Balance: ₹{adminBalance.toFixed(2)}</Text>
              </View>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => handleSendAmount(Number(amount), date, accountType)}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Send ₹{amount || 0}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ marginTop: 16, alignItems: "center" }}
              >
                <Text style={{ color: "#2563eb" }}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default UserAccountScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subDetail: {
    fontSize: 13,
    color: "#777",
    marginTop: 6,
  },
  detail: {
    fontSize: 15,
    color: "#333",
  },
  section: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  transactionCategory: {
    fontSize: 15,
    fontWeight: "500",
  },
  transactionDate: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#e11d48",
  },
  balance: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  accountTypeWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  accountTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2563eb",
    backgroundColor: "#f0f4ff",
    marginHorizontal: 4,
  },
  sendButton: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addAmountButton: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },
});
