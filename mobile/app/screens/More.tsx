import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal } from 'react-native';
import React, { useState } from 'react';
import { Link } from 'expo-router';

const settingsOptions = [
  { id: '1', title: 'Income Category Setting' },
  { id: '2', title: 'Expense Category Setting' },
  { id: '3', title: 'Categories On/Off' },
  { id: '4', title: 'Currency Setting' },
  { id: '5', title: 'Language Setting' },
  { id: '6', title: 'Theme' },
  { id: '7', title: 'Notifications' },
  { id: '8', title: 'Backup & Restore' },
  { id: '9', title: 'Privacy Policy' },
  { id: '10', title: 'About' },
];

const More = () => {
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);
  
  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Configuration</Text>
      </View>
      
      <TouchableOpacity style={styles.item}>
        <Link href={'/configurations/IncomeCategory'} style={styles.text}>Income Category Setting</Link>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Link href={'/configurations/ExpenseCategory'} style={styles.text}>Expense Category Setting</Link>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => setCategoriesModalVisible(true)}>
        <Text style={styles.text}>Categories On/Off</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Link href={'/configurations/Currency'} style={styles.text}>Currency Setting</Link>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.text}>Language Setting</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => setThemeModalVisible(true)}>
        <Text style={styles.text}>Theme</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.text}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.text}>Backup & Restore</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.text}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Link href={'/configurations/About'} style={styles.text}>About</Link>
      </TouchableOpacity>
      
      {/* Theme Modal */}
      <Modal visible={themeModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Theme</Text>
            <TouchableOpacity onPress={() => setThemeModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Categories Modal */}
      <Modal visible={categoriesModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Categories On/Off</Text>
            <TouchableOpacity onPress={() => setCategoriesModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default More;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    fontSize: 16,
    color: 'blue',
    marginTop: 10,
  },
});
