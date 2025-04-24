import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Privacy Policy</Text>

      <Text style={styles.paragraph}>
        At our Budget & Expense Management App, your privacy is extremely
        important to us. This policy outlines how we collect, use, and protect
        your personal data.
      </Text>

      <Text style={styles.subheading}>1. Data Collection</Text>
      <Text style={styles.paragraph}>
        We collect information such as your name, email address, and transaction
        data to help you manage your finances effectively.
      </Text>

      <Text style={styles.subheading}>2. Use of Data</Text>
      <Text style={styles.paragraph}>
        Your data is used solely for:
        {'\n'}• Budget tracking and analysis
        {'\n'}• Personalized reports
        {'\n'}• Family member sharing (Premium feature)
        {'\n'}• Syncing across devices
      </Text>

      <Text style={styles.subheading}>3. Data Sharing</Text>
      <Text style={styles.paragraph}>
        We do not share your personal data with third parties, except when
        required by law or with your explicit consent.
      </Text>

      <Text style={styles.subheading}>4. Security</Text>
      <Text style={styles.paragraph}>
        Your data is encrypted and stored securely. We follow industry-standard
        practices to protect your personal information.
      </Text>

      <Text style={styles.subheading}>5. Family Member Access</Text>
      <Text style={styles.paragraph}>
        Admin users can invite family members to the app. Each member’s data is
        accessible only to the admin and the respective member, ensuring
        transparency and accountability.
      </Text>

      <Text style={styles.subheading}>6. Changes to This Policy</Text>
      <Text style={styles.paragraph}>
        We may update this policy from time to time. Any changes will be posted
        on this page with an updated date.
      </Text>

      <Text style={styles.subheading}>7. Contact Us</Text>
      <Text style={styles.paragraph}>
        If you have any questions or concerns regarding our privacy practices,
        please contact us at:{'\n'}
        <Text style={styles.highlight}>support@maticui.com</Text>
      </Text>

      <Text style={styles.footer}>Last Updated: April 9, 2025</Text>
    </ScrollView>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
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
    fontWeight: '500',
  },
  footer: {
    marginTop: 30,
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
