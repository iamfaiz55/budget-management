import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaWallet,
  FaCreditCard,
  FaThLarge,
  FaUsers,
  FaShieldAlt,
  FaInfoCircle,
  FaTimes,
} from 'react-icons/fa';

const More = () => {
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">⚙️ Settings & Configuration</h1>

      <div className="grid gap-4 max-w-xl mx-auto">
        <SettingItem icon={<FaWallet />} label="Income Category Setting" to="/user/configuration/income-category" />
        <SettingItem icon={<FaCreditCard />} label="Expense Category Setting" to="/user/configuration/expense-category" />
        <SettingItem
          icon={<FaThLarge />}
          label="Categories On/Off"
          onClick={() => setShowCategoriesModal(true)}
        />
        {/* <SettingItem icon={<FaMoneyBillWave />} label="Currency Setting" to="/user/configuration/Currency" /> */}
        <SettingItem icon={<FaUsers />} label="Family" to="/user/family" />
        {/* <SettingItem icon={<FaLanguage />} label="Language Setting" /> */}
        {/* <SettingItem icon={<FaPalette />} label="Theme" onClick={() => setShowThemeModal(true)} /> */}
        {/* <SettingItem icon={<FaBell />} label="Notifications" /> */}
        <SettingItem icon={<FaShieldAlt />} label="Privacy Policy" to="/user/configuration/privacy-policy" />
        <SettingItem icon={<FaInfoCircle />} label="About" to="/user/configuration/About" />
      </div>

      {/* Theme Modal */}
      {showThemeModal && (
        <Modal title="Select Theme" onClose={() => setShowThemeModal(false)}>
          {/* Theme options go here */}
          <p className="text-gray-600">Theme options would be shown here.</p>
        </Modal>
      )}

      {/* Categories Modal */}
      {showCategoriesModal && (
        <Modal title="Categories On/Off" onClose={() => setShowCategoriesModal(false)}>
          {/* Toggle logic goes here */}
          <p className="text-gray-600">You can turn categories on or off here.</p>
        </Modal>
      )}
    </div>
  );
};

const SettingItem = ({
  icon,
  label,
  to,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  to?: string;
  onClick?: () => void;
}) => {
  const content = (
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer">
      <div className="text-blue-600">{icon}</div>
      <span className="text-gray-800 font-medium">{label}</span>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : <div onClick={onClick}>{content}</div>;
};

const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700">
          <FaTimes />
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default More;
