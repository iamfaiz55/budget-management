import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Splash1 from "./splashScreens/Splash1";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [firstTime, setFirstTime] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          // First time launch
          setFirstTime(true);
          await AsyncStorage.setItem("hasLaunched", "true");
        } else {
          // Not the first time, navigate to main route
          router.replace("/screens/Home"); // replace with your actual home route
        }
      } catch (err) {
        console.error("Error checking app launch status", err);
      } finally {
        setLoading(false);
      }
    };

    checkFirstLaunch();
  }, []);

  if (loading) return null; // or return a loading spinner

  return firstTime ? <Splash1 /> : null;
};

export default Index;
