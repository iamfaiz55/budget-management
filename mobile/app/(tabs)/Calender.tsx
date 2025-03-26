  import { View, Text } from "react-native";
  import Day from "./Day";
  import Total from "./Total";
  import Monthly from "./Monthly";
  import MainCalender from "./MainCalender";
  import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

  export const TopTab = createMaterialTopTabNavigator();

  export default function CalendarScreen() {
    return (
      <View style={{ flex: 1 }}>
     
      <TopTab.Navigator
    screenOptions={{
      tabBarActiveTintColor: "white",
      tabBarInactiveTintColor: "lightgray",
      tabBarStyle: { backgroundColor: "#007BFF" },
      tabBarIndicatorStyle: { backgroundColor: "white", height: 3 },
    }}
  >

          <TopTab.Screen name="Day" component={Day} />
          <TopTab.Screen name="Calendar" component={MainCalender} />
          <TopTab.Screen name="Monthly" component={Monthly} />
          <TopTab.Screen name="Total" component={Total} />
        </TopTab.Navigator>
      </View>
    );
  }

