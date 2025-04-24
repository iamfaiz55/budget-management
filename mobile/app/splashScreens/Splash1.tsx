import { StyleSheet, Text, View, Image, Animated, Easing, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';

const Splash1 = () => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate Fade and Scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    router.push('/splashScreens/Splash2');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.mainContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Brand Name */}
        <Text style={styles.brand}>Spendlytics</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Smarter budgeting for everyday life</Text>

        {/* Icon Row */}
        <View style={styles.iconRow}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3576/3576995.png' }}
            style={styles.icon}
          />
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png' }}
            style={styles.icon}
          />
        </View>

        {/* Features */}
        <View style={styles.featuresBox}>
          <Text style={styles.feature}>📅 Daily Tracking with Calendar</Text>
          <Text style={styles.feature}>📈 Smart Expense & Income Stats</Text>
          <Text style={styles.feature}>👨‍👩‍👧‍👦 Family Budget Collaboration</Text>
          <Text style={styles.feature}>📌 Category-based Entries & Notes</Text>
          <Text style={styles.feature}>🧠 Tips for Better Spending</Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        {/* Footer Text */}
        <Text style={styles.footer}>Powered by MaticUI | Budgeting made joyful 💸</Text>
      </Animated.View>
    </View>
  );
};

export default Splash1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF4FF', // Light background color for a fresh feel
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mainContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: 20,
  },
  brand: {
    fontSize: 40, // Large size for the brand name
    fontWeight: 'bold',
    color: '#1565C0', // Primary brand color
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#5C6BC0', // Subtitle color
    marginBottom: 30,
    textAlign: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  icon: {
    width: 70,
    height: 70,
  },
  featuresBox: {
    marginBottom: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  feature: {
    fontSize: 16,
    color: '#2E5AAC', // Feature item color
    marginVertical: 5,
    fontWeight: '500',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#42A5F5', // Button color
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footer: {
    fontSize: 12,
    color: '#78909C', // Footer color
    marginTop: 20,
    textAlign: 'center',
  },
});
