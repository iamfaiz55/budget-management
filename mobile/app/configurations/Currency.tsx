import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const currencies = [
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'ZAR', name: 'South African Rand' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'NZD', name: 'New Zealand Dollar' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'MXN', name: 'Mexican Peso' },
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'SEK', name: 'Swedish Krona' },
  { code: 'NOK', name: 'Norwegian Krone' },
  { code: 'RUB', name: 'Russian Ruble' },
  { code: 'KRW', name: 'South Korean Won' },
];

const Currency = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSelect = (code: string) => {
    setSelectedCurrency(code);
  };

  const filteredCurrencies = currencies.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Select Your Currency</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by country or currency..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredCurrencies}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              item.code === selectedCurrency && styles.selectedItem,
            ]}
            onPress={() => handleSelect(item.code)}
          >
            <Text style={styles.currencyCode}>{item.code}</Text>
            <Text style={styles.currencyName}>{item.name}</Text>
            {item.code === selectedCurrency && (
              <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Currency;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    color: '#333',
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  selectedItem: {
    borderColor: '#007AFF',
    backgroundColor: '#EAF4FF',
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  currencyName: {
    flex: 1,
    marginLeft: 10,
    color: '#666',
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
});
