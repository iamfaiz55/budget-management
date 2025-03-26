// import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, Animated, Easing } from 'react-native';
// import React, { useEffect, useRef } from 'react';
// import { Link, useRouter } from 'expo-router';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { I18nextProvider } from 'react-i18next';
// import i18n from '@/i18n';

// const Index = () => {
//   const router = useRouter();
//   i18n.changeLanguage("en");

//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.8)).current;

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = await AsyncStorage.getItem("authToken");
//       if (token) {
//         router.replace("/screens/Home");
//       }
//     };
//     checkAuth();

//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 1000,
//       easing: Easing.ease,
//       useNativeDriver: true,
//     }).start();

//     Animated.spring(scaleAnim, {
//       toValue: 1,
//       friction: 5,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   return (
//     <I18nextProvider i18n={i18n}>
//       <GestureHandlerRootView style={styles.container}>
//         <Animated.View style={[styles.overlay, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}> 
//           <View style={styles.main}>
//             <Image style={styles.logo} source={{ uri: "https://img.icons8.com/?size=100&id=lQ4UQO3LMB5D&format=png&color=FF7043" }} />
//             <Text style={styles.heading}>Smart Expense & Budgeting</Text>
//             <Text style={styles.description}>
//               Keep track of your finances with ease. Set budgets, monitor spending, and take charge of your financial future.
//             </Text>
//           </View>
//           <Image 
//             style={styles.mainImage} 
//             source={{ uri: "https://media.istockphoto.com/id/2166606956/vector/financial-management-and-budget-planning.jpg?s=612x612&w=0&k=20&c=rAPqB_MouNfkTNLTlwrzkcORRje7APIiiCSjnfoN8-4=" }} 
//           />
//           <Link href={"/authentication/Register"} style={styles.button}>
//             Get Started
//           </Link>
//         </Animated.View>
//       </GestureHandlerRootView>
//     </I18nextProvider>
//   );
// };

// export default Index;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFE0B2", // Warm light theme
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   overlay: {
//     backgroundColor: "rgba(255, 255, 255, 0.9)",
//     paddingVertical: 50,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   main: {
//     alignItems: "center",
//     paddingTop: 50,
//     paddingHorizontal: 30,
//   },
//   logo: {
//     width: 90,
//     height: 90,
//     marginBottom: 20,
//   },
//   heading: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#D84315", // Deep orange text
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   description: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#795548", // Brownish-gray for readability
//     textAlign: "center",
//     maxWidth: 280,
//   },
//   mainImage: {
//     width: Dimensions.get("screen").width * 0.9,
//     height: 200,
//     resizeMode: "contain",
//     marginVertical: 20,
//   },
//   button: {
//     backgroundColor: "#FF7043", // Bright orange button
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 40,
//     textAlign: 'center',
//     borderRadius: 25,
//     width: 220,
//     alignSelf: "center",
//     marginVertical: 20,
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   footerText: {
//     fontSize: 14,
//     color: "#795548",
//   },
//   signInText: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#D84315",
//     marginLeft: 5,
//   },
// });
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Link, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

const Index = () => {
  const router = useRouter();
  i18n.changeLanguage("en");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        router.replace("/screens/Home");
      }
    };
    checkAuth();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);
  // const router = useRouter()

  useEffect(() => {
     const checkAuth = async () => {
       const token = await AsyncStorage.getItem("authToken");
       if (!token) {
         router.replace("/authentication/Login");
       }
     };
     checkAuth();
 
     
   }, []);
  return (
    <I18nextProvider i18n={i18n}>
      <GestureHandlerRootView style={styles.container}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}> 
          <View style={styles.main}>
            <Image style={styles.logo} source={{ uri: "https://media.istockphoto.com/id/1328821578/vector/invoicing-rgb-color-icon.jpg?s=612x612&w=0&k=20&c=Y4SqEJlLnX5c88A-hcoxo46OlF70ic7UJYg-Yv9qK4E=" }} />
            <Text style={styles.heading}>Effortless Expense Management</Text>
            <Text style={styles.description}>
              Gain complete control over your finances with real-time insights, budgeting tools, and automated tracking.
            </Text>
          </View>
          {/* <Image 
            style={styles.mainImage} 
            source={{ uri: "https://media.istockphoto.com/id/2166606956/vector/financial-management-and-budget-planning.jpg?s=612x612&w=0&k=20&c=rAPqB_MouNfkTNLTlwrzkcORRje7APIiiCSjnfoN8-4=" }} 
          /> */}
          <Link href={"/authentication/Register"} style={styles.button}>
            Get Started
          </Link>
          <Text style={styles.additionalText}>Join thousands of users taking control of their financial future today!</Text>
        </Animated.View>
      </GestureHandlerRootView>
    </I18nextProvider>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD", // Light blue background
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingVertical: 50,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  main: {
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1565C0", // Deep blue text
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    color: "#5C6BC0", // Soft blue for readability
    textAlign: "center",
    maxWidth: 280,
  },
  mainImage: {
    width: Dimensions.get("screen").width * 0.9,
    height: 200,
    resizeMode: "contain",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#42A5F5", // Bright blue button
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 40,
    textAlign: 'center',
    borderRadius: 25,
    width: 220,
    alignSelf: "center",
    marginVertical: 20,
  },
  additionalText: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: "#5C6BC0",
  },
  signInText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1565C0",
    marginLeft: 5,
  },
});
