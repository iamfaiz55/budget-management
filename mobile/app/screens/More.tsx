import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const More = () => {
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings & Configuration</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <SettingItem icon="wallet" label="Income Category Setting" href="/configurations/IncomeCategory" />
        <SettingItem icon="card" label="Expense Category Setting" href="/configurations/ExpenseCategory" />
        {/* <SettingItem
          icon="grid"
          label="Categories On/Off"
          onPress={() => setCategoriesModalVisible(true)}
        /> */}
        <SettingItem icon="cash" label="Currency Setting" href="/configurations/Currency" />
        <SettingItem icon="people" label="Family" href="/configurations/Family" />
        {/* <SettingItem icon="language" label="Language Setting" /> */}
        <SettingItem
          icon="color-palette"
          label="Theme"
          onPress={() => setThemeModalVisible(true)}
        />
        {/* <SettingItem icon="notifications" label="Notifications" /> */}
        <SettingItem icon="shield-checkmark" label="Privacy Policy" href="/configurations/PrivacyPolicy" />
        <SettingItem icon="information-circle" label="About" href="/configurations/About" />
      </ScrollView>

      {/* Theme Modal */}
      <Modal visible={themeModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Theme</Text>
            {/* You can add options here */}
            <TouchableOpacity onPress={() => setThemeModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Categories Modal */}
      <Modal visible={categoriesModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Categories On/Off</Text>
            {/* Add toggle logic here */}
            <TouchableOpacity onPress={() => setCategoriesModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const SettingItem = ({ icon, label, href, onPress }: any) => {
  const content = (
    <View style={styles.item}>
      <Ionicons name={icon} size={22} color="#4B5563" style={{ marginRight: 12 }} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );

  return href ? (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.card}>{content}</TouchableOpacity>
    </Link>
  ) : (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {content}
    </TouchableOpacity>
  );
};

export default More;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1F2937',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#374151',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
  },
  closeButton: {
    marginTop: 16,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});
