import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation resources
const resources = {
  en: {
    translation: {
      "Skillhub Clinic": "Skillhub Clinic",
      "Contact": "Contact",
      "Patient Details": "Patient Details",
      "Name": "Name",
      "Contact Info": "Contact Info",
      "Date of Birth": "Date of Birth",
      "Gender": "Gender",
      "Medical Prescription": "Medical Prescription",
      "Sr_No": "Sr. No",
      "Medicine_Name": "Medicine Name",
      "Dose": "Dose",
      "Frequency": "Frequency",
      "Duration": "Duration",
      "Instructions": "Instructions",
      "Quantity": "Quantity",
      "Thank you for choosing our clinic. Wishing you a speedy recovery!":
        "Thank you for choosing our clinic. Wishing you a speedy recovery!",
    },
  },
  mr: {
    translation: {
      "Skillhub Clinic": "स्किलहब क्लिनिक",
      "Contact": "संपर्क",
      "Patient Details": "रुग्ण तपशील",
      "Name": "नाव",
      "Contact Info": "संपर्क माहिती",
      "Date of Birth": "जन्मतारीख",
      "Gender": "लिंग",
      "Medical Prescription": "औषधाची चिठ्ठी",
      "Sr_No": "अनुक्रमांक",
      "Medicine_Name": "औषधाचे नाव",
      "Dose": "मात्रा",
      "Frequency": "वारंवारता",
      "Duration": "कालावधी",
      "Instructions": "सूचना",
      "Quantity": "प्रमाण",
      "Thank you for choosing our clinic. Wishing you a speedy recovery!":
        "आमच्या क्लिनिकची निवड केल्याबद्दल धन्यवाद. तुम्हाला लवकर बरे होण्याची शुभेच्छा!",
    },
  },
};

// Initialize i18n
i18n
  .use(initReactI18next) // Bind react-i18next to React
  .init({
    resources,
    lng: "en", // Default language
    fallbackLng: "en", // Fallback if translation is missing
    interpolation: { escapeValue: false }, // React already handles escaping
  });

export default i18n;
