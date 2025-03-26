import React, { useState, useRef } from "react";
import { View, Dimensions, Text, TouchableOpacity, Animated } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import Income from "./Income";
import Expense from "./Expense";
import All from "./All";

const initialLayout = { width: Dimensions.get("window").width };

export default function StatLayout() {
  const [index, setIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const [routes] = useState([
    // { key: "all", title: "All" },
    { key: "expense", title: "Expense" },
    { key: "income", title: "Income" },
  ]);

  const renderScene = SceneMap({
    all: All,
    income: Income,
    expense: Expense,
  });

  const handleIndexChange = (i: number) => {
    setIndex(i);
    Animated.spring(translateX, {
      toValue: (Dimensions.get("window").width / routes.length) * i,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Animated.View
        style={{
          position: "absolute",
          top: 40, 
          left: 0,
          width: Dimensions.get("window").width / routes.length,
          height: 3,
          backgroundColor: "white",
          transform: [{ translateX }],
        }}
      />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={handleIndexChange}
        initialLayout={initialLayout}
      />
    </View>
  );
}
