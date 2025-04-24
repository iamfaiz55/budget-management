import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
        const navigate = useNavigate()
    
  return <>
    <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">
    ← Back
  </button>
    <div className="max-w-4xl mx-auto px-4 py-10 bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">About This App</h1>

      <p className="mb-6 text-base leading-relaxed">
        This Budget & Expense Management App helps you take control of your finances with ease. Track your income, monitor your spending, and stay organized — all in one place.
      </p>

      <Section title="Premium Features">
        With premium access, you can:
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Add family members to your account</li>
          <li>Each member can record their own transactions</li>
          <li>Admin can manage members and view detailed reports on how many transactions each member has made</li>
        </ul>
      </Section>

      <Section title="Admin Capabilities">
        The admin has full control to:
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Add or remove family members</li>
          <li>View total and individual transactions</li>
          <li>Maintain budget and monitor spending habits</li>
        </ul>
      </Section>

      <Section title="Developer Info">
        Developed by <span className="text-blue-600 font-semibold">Shaikh Faiz</span>
        <br />
        Proudly built and maintained by <span className="text-blue-600 font-semibold">Matic UI</span>
      </Section>
    </div>
    </>
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
    <p className="text-base leading-relaxed text-gray-600">{children}</p>
  </div>
);

export default About;
