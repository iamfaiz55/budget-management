import { Stack, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import reduxStore from "@/redux/store";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const router = useRouter()

  //  useEffect(() => {
  //     const checkAuth = async () => {
  //       const token = await AsyncStorage.getItem("authToken");
  //       if (!token) {
  //         router.replace("/authentication/Login");
  //       }
  //     };
  //     checkAuth();
  
      
  //   }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={reduxStore}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="(tabs)" />  */}
          {/* <Stack.Screen name="(stats)" />  */}

          <Stack.Screen name="splashScreens" /> 
          <Stack.Screen name="screens" /> 
          <Stack.Screen name="configurations" /> 
          <Stack.Screen name="authentication" /> 
        </Stack>
      </Provider>
    </GestureHandlerRootView>
  );
}
