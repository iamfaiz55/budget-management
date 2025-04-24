import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import {
  TextInput,
  Button,
  Text,
  PaperProvider,
  RadioButton,
  Modal,
  Portal,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useAddTransactionMutation } from "@/redux/transactionApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useGetCategoriesQuery } from "@/redux/categoryApi";

const accounts = ["Cash", "Card", "Account"];

const AddTransactionScreen = () => {
  const {data}=useGetCategoriesQuery()
  const [addTransaction, {isSuccess,  isError, error}]= useAddTransactionMutation()
    const today = new Date().toISOString().split('T')[0];
  const route = useRouter();
  const { date } = useLocalSearchParams();
// console.log("==========", date);

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      amount: "",
      category: "",
      account: "Cash",
      note: "",
      type: "expense",
    },
  });

  const [transactionType, setTransactionType] = useState("expense");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isNewCategoryModalVisible, setNewCategoryModalVisible] = useState(false);

  const handleTransactionType = (type:string) => {
    setTransactionType(type);
    setValue("type", type);
    setSelectedCategory(""); // Reset category on type switch
    setValue("category", "");
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setValue("category", category);
    setCategoryModalVisible(false);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== "") {
      // initialCategories.push(newCategory);
      setSelectedCategory(newCategory);
      setValue("category", newCategory);
      setNewCategory("");
      setNewCategoryModalVisible(false);
    }
  };

  const onSubmit = (data: any) => {
    // console.log("Transaction Data:", { ...data, date:date ? date : today });
    addTransaction({ ...data, date:date ? date : today })
    
  };

 
  useEffect(() => {
    if (isError && error) {
      Toast.show({
        type: 'error',
        text1: 'Transaction Failed',
        text2: error as string, 
        position: 'bottom',
      });
    }
  }, [isError, error]);
  useEffect(() => {
    if (isError && error) {
      Toast.show({
        type: 'error',
        text1: 'Transaction Failed',
        text2: error as string, 
        position: 'bottom',
      });
    }
    if(isSuccess){
      // console.log("transaction addded success");
      Toast.show({
        type: 'success',
        text1: 'Transaction Success',
        // text2: , 
        position: 'bottom',
      });
      route.back()
    }
  }, [isError,isSuccess]);
  
  
  const router = useRouter()

  useEffect(() => {
     const checkAuth = async () => {
       const token = await AsyncStorage.getItem("authToken");
       if (!token) {
         router.replace("/authentication/Login");
       }
     };
     checkAuth();
 
     
   }, []);
   const filteredCategories = data?.result?.filter((cat) => cat.type === transactionType) || [];

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => route.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Transaction</Text>
        </View>

        <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled={true} contentContainerStyle={{ paddingBottom: 20 }}>
          {/* 1. Transaction Type Selection */}
          <View style={styles.selectionContainer}>
            {["income", "expense"].map((type) => (
              <Button
                key={type}
                mode={transactionType === type ? "contained" : "outlined"}
                onPress={() => handleTransactionType(type)}
                style={[styles.selectionButton, transactionType === type && styles.selectedButton]}
                labelStyle={[styles.selectionText, transactionType === type && styles.selectedText, { fontSize: 12 }]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </View>

          {/* 2. Selected Date */}
          <TextInput 
  label="Selected Date" 
  value={date ? (Array.isArray(date) ? date[0] : date.toString()) : today} 
  style={[styles.input, styles.spacing]} 
  editable={false} 
/>

          {/* 3. Amount Field */}
          <Controller
            control={control}
            name="amount"
            rules={{ required: "Amount is required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextInput
                label="Amount"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                style={[styles.input, styles.spacing]}
                error={!!error}
              />
            )}
          />

          {/* 4. Account Selection */}
          <View style={[styles.selectionContainer, styles.spacing]}>
            <Text >Account:</Text>
            <Controller
              control={control}
              name="account"
              render={({ field: { onChange, value } }) => (
                <RadioButton.Group onValueChange={onChange} value={value}>
                  <View style={styles.accountContainer}>
                    {accounts.map((account) => (
                      <View key={account} style={styles.radioWrapper}>
                        <RadioButton value={account} />
                        <Text>{account}</Text>
                      </View>
                    ))}
                  </View>
                </RadioButton.Group>
              )}
            />
          </View>

          {/* 5. Category Selection (Modal Trigger) */}
          <Button mode="outlined" onPress={() => setCategoryModalVisible(true)} style={[styles.input, styles.spacing]}>
            {selectedCategory ? selectedCategory : "Select Category"}
          </Button>

          

          {/* 6. Note Field */}
          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, value } }) => (
              <TextInput label="Note" value={value} onChangeText={onChange} style={[styles.input, styles.spacing]} multiline />
            )}
          />

          {/* Save Button */}
          <Button mode="contained" onPress={handleSubmit(onSubmit)} style={[styles.button, styles.spacing]}>
            Save Transaction
          </Button>
        </ScrollView>

        {/* Category Selection Modal */}
        <Portal>
          <Modal visible={isCategoryModalVisible} onDismiss={() => setCategoryModalVisible(false)} contentContainerStyle={styles.modalContainer}>
            <Text>Select a Category</Text>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <Button key={category._id} onPress={() => handleCategorySelect(category.name)}>
                  {category.name}
                </Button>
              ))
            ) : (
              <Text style={{ marginTop: 10 }}>No categories found for {transactionType}</Text>
            )}
          </Modal>
        </Portal>

        {/* Add New Category Modal */}
        <Portal>
          <Modal visible={isNewCategoryModalVisible} onDismiss={() => setNewCategoryModalVisible(false)} contentContainerStyle={styles.modalContainer}>
            <Text>Add New Category</Text>
            <TextInput label="Category Name" value={newCategory} onChangeText={setNewCategory} style={styles.input} />
            <Button mode="contained" onPress={handleAddCategory} >
              Add
            </Button>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
};

export default AddTransactionScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//     backgroundColor: "#f9f9f9",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 10,
//     marginBottom: 10,
//   },
//   backButton: {
//     marginRight: 15,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   selectionContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 15,
//     marginTop: 20,
//     alignItems: "center",
//   },
//   input: {
//     marginBottom: 15,
//     backgroundColor: "#fff",
//   },
//   button: {
//     marginTop: 10,
//     borderRadius: 8,
//   },
//   modalContainer: {
//     backgroundColor: "white",
//     padding: 20,
//     marginHorizontal: 20,
//     borderRadius: 10 {
//     marginVertical: 5,
//   },
// });
const primaryColor = "#007BFF"; // Vibrant blue
const secondaryColor = "#6200EA"; // Deep purple
const backgroundColor = "#F4F6F8"; // Soft background
const textColor = "#333"; // Dark text for contrast
const white = "#FFF";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: backgroundColor, // Softer background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: primaryColor,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
    color: secondaryColor,
  },
  selectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    marginTop: 20,
    alignItems: "center",
  },
  selectionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: primaryColor,
  },
  selectedButton: {
    backgroundColor: primaryColor,
  },
  selectionText: {
    color: primaryColor,
  },
  selectedText: {
    color: white,
  },
  accountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  radioWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    marginBottom: 15,
    backgroundColor: white,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  dropdown: {
    marginBottom: 15,
    zIndex: 10,
    backgroundColor: white,
  },
  addCategoryButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
    color: primaryColor,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: primaryColor,
  },
  modalContainer: {
    backgroundColor: white,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // For Android shadow
  },
  spacing: {
    marginVertical: 10,
  },
});