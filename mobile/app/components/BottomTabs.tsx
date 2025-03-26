import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import CalendarScreen from "../(tabs)/Calender";
import Day from "../(tabs)/Day";
import Total from "../(tabs)/Total";
import Monthly from "../(tabs)/Monthly";
import { Appbar } from "react-native-paper";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    const getIconName = (routeName: string): keyof typeof Ionicons.glyphMap => {
        switch (routeName) {
          case "Calendar":
            return "calendar-outline";
          case "Day":
            return "today-outline";
          case "Total":
            return "stats-chart-outline";
          case "Monthly":
            return "bar-chart-outline";
          default:
            return "help-circle-outline"; // Fallback icon
        }
      };
  return (
    <>
      {/* Top App Bar */}
      <Appbar.Header style={{ backgroundColor: "#007BFF" }}>
        <Appbar.Content title="Finance Tracker" titleStyle={{ color: "white" }} />
      </Appbar.Header>

      {/* Bottom Tabs */}
      <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ color, size }) => (
      <Ionicons name={getIconName(route.name)} size={size} color={color} />
    ),
    tabBarActiveTintColor: "#007BFF",
    tabBarInactiveTintColor: "gray",
    headerShown: false,
  })}
>
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Day" component={Day} />
        <Tab.Screen name="Total" component={Total} />
        <Tab.Screen name="Monthly" component={Monthly} />
      </Tab.Navigator>
    </>
  );
}
