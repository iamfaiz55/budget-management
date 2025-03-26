import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ConfigurationLayout = () => {
  return (
     <Stack
               screenOptions={{ headerShown: false }}>
               <Stack.Screen name="Currency" />
               <Stack.Screen name="About" />
               <Stack.Screen name="ExpenseCategory" />
               <Stack.Screen name="IncomeCategory" />
           </Stack>
  )
}

export default ConfigurationLayout

const styles = StyleSheet.create({})