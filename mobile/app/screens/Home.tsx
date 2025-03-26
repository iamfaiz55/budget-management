import { useEffect, useState } from "react";
import { BottomNavigation, Text } from "react-native-paper";
import CalendarScreen from "../(tabs)/Calender";
// import StatMain from "../(stats)/StatMain";
import Account from "./Account";
import More from "./More";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StatLayout from "../(stats)/_layout";




const HomeScreen = () => {
  const [index, setIndex] = useState(0);
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
  const [routes] = useState([
    { key: "calendar", title: "Calendar", focusedIcon: "calendar" },
    { key: "stats", title: "Stats", focusedIcon: "chart-bar" },
    { key: "account", title: "Account", focusedIcon: "account" },
    { key: "more", title: "More", focusedIcon: "dots-horizontal" },
  ]);

  // ✅ Use a function instead of SceneMap
  const renderScene = ({ route }:any) => {
    switch (route.key) {
      case "calendar":
        return <CalendarScreen />;
      case "stats":
        return <StatLayout />; 
      case "account":
        return <Account />;
      case "more":
        return <More />;
      default:
        return null;
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene} 
      shifting={true}
    />
  );
};

export default HomeScreen;
