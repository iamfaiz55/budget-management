import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import Toast from 'react-native-toast-message'

const SplashLayout = () => {
  return <>
     <Stack
               screenOptions={{ headerShown: false }}>
               <Stack.Screen name="Splash1" />
               <Stack.Screen name="Splash2" />
           
           </Stack>
           <Toast/>
  </>
}

export default SplashLayout

const styles = StyleSheet.create({})