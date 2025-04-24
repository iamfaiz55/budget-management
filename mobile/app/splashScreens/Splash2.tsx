import { StyleSheet, Text, View, Image, Animated, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';

const Splash2 = () => {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleContinue = () => {
    router.replace('/authentication/Login');
  };

  return (
    <View style={styles.container}>
      {/* Animated Image at the top of the screen */}
      <Animated.Image
        source={{ uri: 'https://img.icons8.com/?size=160&id=NLb8jtHiVeEm&format=png' }}
        style={[styles.image, { transform: [{ scale: scaleAnim }] }]}
      />
      
      <View style={styles.contentContainer}>
        {/* Main heading */}
        <Text style={styles.text}>Managing Finances Made Simple</Text>

        {/* Pros of the app */}
        <View style={styles.prosContainer}>
          <Text style={styles.subheading}>Why use Spendlytics?</Text>
          <Text style={styles.prosText}>✔ Track expenses in real-time</Text>
          <Text style={styles.prosText}>✔ Easily manage family budgets</Text>
          <Text style={styles.prosText}>✔ Visualize your spending habits</Text>
          <Text style={styles.prosText}>✔ Set goals for savings and expenses</Text>
        </View>

        {/* Button to navigate to the login page */}
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Text */}
      <Text style={styles.footer}>Powered by Spendlytics | Simplify your financial life 💰</Text>
    </View>
  );
};

export default Splash2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF4FF', // Light background color for a fresh feel
    justifyContent: 'flex-start', // Align content to the top
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40, // Added padding to top for space
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Align content to the top
    alignItems: 'center',
    marginBottom: 40, // Add spacing between content and footer
    width: '100%',
  },
  text: {
    color: '#1565C0', // Matching color with Splash1
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  prosContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 30,
    width: '100%',
  },
  prosText: {
    color: '#2E5AAC', // Matching color with Splash1
    fontSize: 16,
    marginVertical: 5,
    fontWeight: '500',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 18,
    color: '#FFEB3B', // Yellow color for contrast
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#42A5F5',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footer: {
    fontSize: 12,
    color: '#78909C',
    marginTop: 20,
    textAlign: 'center',
  },
});
