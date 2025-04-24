import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useGetAllTransactionsQuery } from "../../redux/transactionApi";
import {
  useAddPersonMutation,
  useGetMyPlanQuery,
} from "../../redux/subscriptionApi";
import { useGetAllUsersQuery } from "../../redux/userApi";
import { useUserStore } from "@/redux/userStore";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { IUser } from "@/models/user.interface";

interface User {
  _id: string;
  name: string;
  email?: string;
  mobile?: string | number;}



const Family = () => {
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: planData } = useGetMyPlanQuery();
  const router = useRouter()
  
  const { data: usersData } = useGetAllUsersQuery({
    searchQuery,
    isFetchAll: true,
  });
  const { data: transactionsData } = useGetAllTransactionsQuery();
  
  const [addPerson, { isSuccess: personAdded }] = useAddPersonMutation();

  const isPlanActive = planData?.result?.isActive;
  const planEndDate = new Date(planData?.result?.endDate || "");
  const isPremium = isPlanActive && planEndDate > new Date();

  const familyUsers: IUser[] = (planData?.result?.users || []).map((user) => ({
    ...user,
    role: user.role || "user", 
    mobile: typeof user.mobile === "number" ? user.mobile : user.mobile || "N/A", 
  }));
  
  const handleAddPress = () => {
    if (isPremium) {
      setAddModalVisible(true);
    } 
  };
 

  useEffect(() => {
    if (personAdded) {
      setAddModalVisible(false);
    }
  }, [personAdded]);

 
  const renderFamilyUser = ({ item }: { item: User }) => (
    <TouchableOpacity
    style={styles.familyItem}
    onPress={() => {
      const currentUser = familyUsers.find((u) => u._id === item._id);
      
      const transactions = transactionsData?.result?.filter(
        (txn) => txn.user?._id === item._id
      ) || [];
  
      useUserStore.getState().setUserData(currentUser!, transactions, transactionsData?.balance || 0);
      router.push("/configurations/UserDetailScreen");
    }}
  >
    <View>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userContact}>{item.email || item.mobile}</Text>
    </View>
    <Text style={styles.viewText}>View ➜</Text>
  </TouchableOpacity>
  );

  const renderUserToAdd = ({ item }: { item: User }) => {
    const isAlreadyAdded = familyUsers.some((u) => u._id === item._id);
    const isSelf = item._id === planData?.result?.admin?._id;

    if (isSelf) return null;

    return (
      <View
        style={[styles.addUserItem, isAlreadyAdded && { opacity: 0.5 }]}
      >
        <View>
          <Text style={styles.userName}>{item.name}</Text>
          <Text>{item.email}</Text>
          <Text>{item.mobile}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.addButton,
            isAlreadyAdded && styles.disabledButton,
          ]}
          disabled={isAlreadyAdded}
          onPress={() => addPerson({ personId: item._id })}
        >
          <Text style={styles.addButtonText}>
            {isAlreadyAdded ? "Added" : "Add"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };




  return (
    <SafeAreaView style={styles.container}>
      {/* Back Bar */}
     <View style={styles.header}>
  <TouchableOpacity style={styles.improvedBackButton} onPress={() => router.back()}>
    <ArrowLeft size={20} color="#2563eb" />
    <Text style={styles.backButtonText}>Back</Text>
  </TouchableOpacity>
</View>


      <>
        <Text style={styles.sectionTitle}>Family Members</Text>

        <FlatList
          data={familyUsers as User[]}
          renderItem={renderFamilyUser}
          keyExtractor={(item) => item._id}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleAddPress}>
          <Text style={styles.primaryButtonText}>Add User</Text>
        </TouchableOpacity>
      </>




      {/* Add User Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.fullscreenModal}>
          <Text style={styles.modalTitle}>Add a New User</Text>
          <TextInput
            placeholder="Search by email or number"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.input}
          />
          <FlatList
              data={
                (usersData?.result || [])
                  .filter((user): user is IUser => !!user._id) 
                  .map((user) => ({
                    ...user,
                    _id: user._id!, 
                    name: user.name || "Unknown",
                    mobile: user.mobile?.toString() || "N/A",
                  }))
              }
            renderItem={renderUserToAdd}
            keyExtractor={(item) => item._id}
          />
          <TouchableOpacity
            style={[styles.primaryButton, { marginTop: 10, backgroundColor: "#888" }]}
            onPress={() => setAddModalVisible(false)}
          >
            <Text style={styles.primaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

   
    </SafeAreaView>
  );
};



export default Family;


const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  accountTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2563eb",
    marginHorizontal: 4,
    backgroundColor: "#f0f4ff",
  },
  
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  familyItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userName: {
    fontWeight: "bold",
  },
  userContact: {
    color: "#555",
  },
  viewText: {
    color: "#f00",
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  fullscreenModal: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  addUserItem: {
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  transactionAmount: {
    color: "red",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    fontSize: 16,
    color: "#2563eb",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  improvedBackButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0ecff", // light blueish background
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  backButtonText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#2563eb",
    fontWeight: "500",
  },
  
});
