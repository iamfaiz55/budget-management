import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';

const About = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>About This App</Text>

      <Text style={styles.paragraph}>
        This Budget & Expense Management App helps you take control of your
        finances with ease. Track your income, monitor your spending, and stay
        organized — all in one place.
      </Text>

      <Text style={styles.subheading}>Premium Features</Text>
      <Text style={styles.paragraph}>
        With premium access, you can:
        {'\n'}• Add family members to your account
        {'\n'}• Each member can record their own transactions
        {'\n'}• Admin can manage members and view detailed reports on how many
        transactions each member has made
      </Text>

      <Text style={styles.subheading}>Admin Capabilities</Text>
      <Text style={styles.paragraph}>
        The admin has full control to:
        {'\n'}• Add or remove family members
        {'\n'}• View total and individual transactions
        {'\n'}• Maintain budget and monitor spending habits
      </Text>

      <Text style={styles.subheading}>Developer Info</Text>
      <Text style={styles.paragraph}>
        Developed by <Text style={styles.highlight}>Shaikh Faiz</Text>{'\n'}
        Proudly built and maintained by{' '}
        <Text style={styles.highlight}>Matic UI</Text>
      </Text>
    </ScrollView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1F2937',
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#374151',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4B5563',
  },
  highlight: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
