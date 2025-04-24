// import i18n from "@/i18n";
// import * as Print from "expo-print";
// import * as Sharing from "expo-sharing";

// // Convert numbers to Marathi numerals
// const convertToMarathiNumerals = (number: any) => {
//   const marathiNumerals = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
//   return number
//     .toString()
//     .split("")
//     .map((digit: any) => (digit >= "0" && digit <= "9" ? marathiNumerals[parseInt(digit)] : digit))
//     .join("");
// };

// // Transliterate text into Marathi using Google Input Tools API
// const transliterateToMarathi = async (text: string) => {
//   const url = `https://inputtools.google.com/request?itc=mr-t-i0-und&text=${text}&num=1`;

//   try {
//     const response = await fetch(url, { method: "GET" });
//     const data = await response.json();
//     if (data[0] === "SUCCESS") {
//       return data[1][0][1][0]; // Extract transliterated text
//     }
//   } catch (error) {
//     console.error("Error fetching transliteration:", error);
//   }
//   return text; // Return original text if transliteration fails
// };

// const GeneratePDF = async (t: any, formData: any) => {
//   console.log("formData on generate pdf", formData.medical[0]?.frequency);
  
//   const patientData = {
//     name: formData.patient || "",
//     age: formData.age || "",
//     bloodPressure: formData.bp || "",
//     pulse: formData.pulse || "",
//     respiratoryRate: formData.rs || "",
//     temperature: formData.temp || "",
//     weight: formData.weight || "",
//     diagnosis: formData.diagnose || "",
//     note: formData.note || "",
//   };

//   const allMedicines = formData.medical || [];
//   let formattedMedicines = [];

//   try {
//     formattedMedicines = await Promise.all(
//       allMedicines.map(async (med: any) => {
//         // ✅ Convert frequency object into an array
//         const frequencyKeys = ["morning", "afternoon", "evening", "night"];
//         const selectedFrequencies = frequencyKeys.filter((key) => med.frequency?.[key]);

//         // ✅ Transliterate frequencies if the language is Marathi
//         const formattedFrequency =
//           i18n.language === "mr"
//             ? await Promise.all(selectedFrequencies.map((fr) => transliterateToMarathi(fr)))
//             : selectedFrequencies;

//         return {
//           medicine: i18n.language === "mr" ? await transliterateToMarathi(med.medicine || "") : med.medicine,
//           instructions: i18n.language === "mr" ? await transliterateToMarathi(med.instructions || "") : med.instructions,
//           testName: i18n.language === "mr" ? await transliterateToMarathi(med.testName || "") : med.testName,
//           frequency: formattedFrequency.length > 0 ? formattedFrequency.join(", ") : "-",
//           dosage: i18n.language === "mr" ? convertToMarathiNumerals(med.dosage || "0") : med.dosage,
//           duration: i18n.language === "mr" ? convertToMarathiNumerals(med.duration || "0") : med.duration,
//           quantity: i18n.language === "mr" ? convertToMarathiNumerals(med.quantity || "0") : med.quantity,
//           mg: i18n.language === "mr" ? convertToMarathiNumerals(med.mg || "0") : med.mg,
//         };
//       })
//     );
//   } catch (error) {
//     console.log("formattedMedicines error", error);
//   }
//   console.log("formattedMedicines:", formattedMedicines);

//   // Generate HTML for PDF
//   const html = `
//     <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
//           .header { text-align: center; padding-bottom: 10px; border-bottom: 2px solid #007BFF; margin-bottom: 20px; }
//           .header h1 { color: #007BFF; margin: 0; }
//           .header p { font-size: 14px; color: #555; }
//           table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//           table, th, td { border: 1px solid #ddd; }
//           th, td { padding: 10px; text-align: center; }
//           th { background: #007BFF; color: white; }
//           .footer { text-align: center; font-size: 12px; margin-top: 20px; color: gray; }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h1>${t("Skillhub Clinic")}</h1>
//           <p>१२३, हेल्थ स्ट्रीट, सिटी | ${t("Contact")}: +1234567890</p>
//         </div>

//         <h2>${t("Patient Details")}</h2>
//         <p><strong>${t("Name")}:</strong> ${patientData.name}</p>
//         <p><strong>${t("Age")}:</strong> ${patientData.age}</p>
//         <p><strong>${t("Blood Pressure")}:</strong> ${patientData.bloodPressure}</p>
//         <p><strong>${t("Pulse")}:</strong> ${patientData.pulse}</p>
//         <p><strong>${t("Respiratory Rate")}:</strong> ${patientData.respiratoryRate}</p>
//         <p><strong>${t("Temperature")}:</strong> ${patientData.temperature}</p>
//         <p><strong>${t("Weight")}:</strong> ${patientData.weight} kg</p>
//         <p><strong>${t("Diagnosis")}:</strong> ${patientData.diagnosis}</p>
//         <p><strong>${t("Doctor's Notes")}:</strong> ${patientData.note}</p>

//         <h2>${t("Medical Prescription")}</h2>
//         <table>
//           <tr>
//             <th>${t("Sr_No")}</th>
//             <th>${t("Medicine_Name")}</th>
//             <th>${t("Dose (mg)")}</th>
//             <th>${t("Dosage")}</th>
//             <th>${t("Frequency")}</th>
//             <th>${t("Duration (days)")}</th>
//             <th>${t("Instructions")}</th>
//             <th>${t("Quantity")}</th>
//             <th>${t("Test Name")}</th>
//           </tr>
//           ${formattedMedicines
//             .map(
//               (med, index) => `
//             <tr>
//               <td>${i18n.language === "mr" ? convertToMarathiNumerals(index + 1) : index + 1}</td>
//               <td>${med.medicine}</td>
//               <td>${med.mg}</td>
//               <td>${med.dosage}</td>
//               <td>${med.frequency}</td>
//               <td>${med.duration}</td>
//               <td>${med.instructions}</td>
//               <td>${med.quantity}</td>
//               <td>${med.testName}</td>
//             </tr>
//           `
//             )
//             .join("")}
//         </table>

//         <div class="footer">
//           <p>${t("Thank you for choosing our clinic. Wishing you a speedy recovery!")}</p>
//         </div>
//       </body>
//     </html>
//   `;

//   try {
//     const { uri } = await Print.printToFileAsync({ html, base64: false });
//     if (await Sharing.isAvailableAsync()) {
//       await Sharing.shareAsync(uri);
//       console.log("PDF Shared");
//     } else {
//       alert(t("Sharing is not available"));
//       console.log("Sharing is not available");
//     }
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//   }
// };

// export default GeneratePDF;
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const GeneratePDF = () => {
  return (
    <View>
      <Text>GeneratePDF</Text>
    </View>
  )
}

export default GeneratePDF

const styles = StyleSheet.create({})