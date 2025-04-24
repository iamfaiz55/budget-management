import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import Toast from 'react-native-toast-message'

const ConfigurationLayout = () => {
  return <>
     <Stack
               screenOptions={{ headerShown: false }}>
               <Stack.Screen name="Currency" />
               <Stack.Screen name="Family" />
               <Stack.Screen name="Plans" />
               <Stack.Screen name="About" />
               <Stack.Screen name="ExpenseCategory" />
               <Stack.Screen name="IncomeCategory" />
               <Stack.Screen name="UserDetailScreen" />
               <Stack.Screen name="PrivacyPolicy" />
           </Stack>
           <Toast/>
  </>
}

export default ConfigurationLayout

const styles = StyleSheet.create({})