import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAddCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery } from '@/redux/categoryApi';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});

type CategoryForm = z.infer<typeof categorySchema>;

const ExpenseCategory = () => {
  const router = useRouter();
  const [deletCat, {isSuccess:deleteSuccess}]= useDeleteCategoryMutation()
  const { data, refetch } = useGetCategoriesQuery();
  const [addCat, { isSuccess }] = useAddCategoryMutation();
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
const [addModel, setAddModel] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    const getUserId = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUserId(parsedUser._id);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
    if(deleteSuccess){
       setShowDeleteModal(false);
       refetch()
    }
  }, [isSuccess, deleteSuccess]);

  const onSubmit = async (formData: CategoryForm) => {
    if (!userId) {
      Alert.alert('User not found', 'Please login again.');
      return;
    }

    try {
      await addCat({
        name: formData.name,
        type: 'expense',
 
      });
      reset();
      setAddModel(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add category');
    }
  };

  const expenseCategories = data?.result?.filter((cat: any) => cat.type === 'expense') || [];


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Expense Categories</Text>

      <FlatList
        data={expenseCategories}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <Ionicons name="pricetag-outline" size={20} color="#007AFF" />
            <Text style={styles.categoryText}>{item.name}</Text>
        
            {item.createdBy == userId && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  setSelectedCategory(item)
                  setShowDeleteModal(true)
                }}
              >
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              </TouchableOpacity>
            )}
          </View>
        )}
        
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
            No expense categories found.
          </Text>
        }
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setAddModel(true)}>
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add Category</Text>
      </TouchableOpacity>

      
   {/* Add Modal */}
   <Modal visible={addModel} animationType="slide" transparent>
  <View style={styles.modalOverlay}>
    <View style={styles.addModal}>
      <Ionicons name="add-circle-outline" size={48} color="#007AFF" style={{ alignSelf: 'center' }} />
      <Text style={styles.modalTitle}>Add New Category</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Enter category name"
            placeholderTextColor="#999"
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

      <View style={styles.modalActions}>
        <TouchableOpacity
          style={[styles.modalButton, styles.cancelAction]}
          onPress={() => {
            setAddModel(false);
            reset();
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.modalButton, styles.saveAction]} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>





      {/*delete Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
  <View style={styles.modalOverlay}>
    <View style={styles.deleteModal}>
      <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" style={{ alignSelf: 'center' }} />
      <Text style={styles.modalTitle}>Confirm Deletion</Text>
      <Text style={styles.modalMessage}>
        Are you sure you want to delete <Text style={{ fontWeight: 'bold' }}>{selectedCategory?.name}</Text>?
      </Text>

      <View style={styles.modalActions}>
        <TouchableOpacity
          style={[styles.modalButton, styles.cancelAction]}
          onPress={() => setShowDeleteModal(false)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modalButton, styles.deleteAction]}
          onPress={() => {
            deletCat(selectedCategory._id)
            // console.log('delete', selectedCategory._id); // replace with delete logic
            // setShowDeleteModal(false);
          }}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


    </View>
  );
};

export default ExpenseCategory;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  categoryText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
    fontSize: 13,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#EAF4FF',
    alignSelf: 'flex-start',
  },
  
  backText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 6,
    fontWeight: '600',
  },
  deleteButton: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteModal: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    elevation: 5,
    alignItems: 'center',
  },
  
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
  },
  
  // modalActions: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   marginTop: 20,
  //   width: '100%',
  // },
  
  // modalButton: {
  //   flex: 1,
  //   paddingVertical: 12,
  //   borderRadius: 10,
  //   alignItems: 'center',
  //   marginHorizontal: 5,
  // },
  
  cancelAction: {
    backgroundColor: '#f0f0f0',
  },
  
  deleteAction: {
    backgroundColor: '#FF3B30',
  },
  
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  addModal: {
  width: '85%',
  backgroundColor: '#fff',
  padding: 24,
  borderRadius: 16,
  elevation: 5,
  alignItems: 'center',
},

saveAction: {
  backgroundColor: '#007AFF',
},

modalButton: {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: 'center',
  marginHorizontal: 5,
},

modalActions: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
  width: '100%',
},

  
});
