import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    const navigate = useNavigate()
    
  return <>
    <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">
    ← Back
  </button>
    <div className="max-w-4xl mx-auto px-4 py-10 bg-gray-50 text-gray-800">
      
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Privacy Policy</h1>

      <p className="mb-6 text-base leading-relaxed">
        At our Budget & Expense Management App, your privacy is extremely important to us. This policy outlines how we collect, use, and protect your personal data.
      </p>

      <Section title="1. Data Collection">
        We collect information such as your name, email address, and transaction data to help you manage your finances effectively.
      </Section>

      <Section title="2. Use of Data">
        Your data is used solely for:
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Budget tracking and analysis</li>
          <li>Personalized reports</li>
          <li>Family member sharing (Premium feature)</li>
          <li>Syncing across devices</li>
        </ul>
      </Section>

      <Section title="3. Data Sharing">
        We do not share your personal data with third parties, except when required by law or with your explicit consent.
      </Section>

      <Section title="4. Security">
        Your data is encrypted and stored securely. We follow industry-standard practices to protect your personal information.
      </Section>

      <Section title="5. Family Member Access">
        Admin users can invite family members to the app. Each member’s data is accessible only to the admin and the respective member, ensuring transparency and accountability.
      </Section>

      <Section title="6. Changes to This Policy">
        We may update this policy from time to time. Any changes will be posted on this page with an updated date.
      </Section>

      <Section title="7. Contact Us">
        If you have any questions or concerns regarding our privacy practices, please contact us at:
        <br />
        <span className="text-blue-600 font-medium">support@maticui.com</span>
      </Section>

      <p className="mt-10 text-sm text-center text-gray-500">
        Last Updated: April 9, 2025
      </p>
    </div>
    </>
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
    <p className="text-base leading-relaxed text-gray-600">{children}</p>
  </div>
);

export default PrivacyPolicy;
