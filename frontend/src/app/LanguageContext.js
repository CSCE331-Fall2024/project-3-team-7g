// "use client"; // Add this to the top of your file

// import React, { createContext, useState, useEffect, useContext } from 'react';

// const LanguageContext = createContext();

// export const LanguageProvider = ({ children }) => {
//   const [language, setLanguage] = useState('en'); // Default to English
//   const [translatedContent, setTranslatedContent] = useState({});

//   useEffect(() => {
//     const savedLanguage = localStorage.getItem('language') || 'en'; // Default to English if not set
//     setLanguage(savedLanguage);
//   }, []);

//   const switchLanguage = async (newLanguage, pageContent) => {
//     console.log("Switching language to:", newLanguage);
//     console.log("Page content to translate:", pageContent);

//     if (newLanguage === language) return;

//     setLanguage(newLanguage);
//     localStorage.setItem("language", newLanguage);

//     const translatedTexts = await translatePageContent(pageContent, newLanguage);
//     console.log("Translated content:", translatedTexts);

//     setTranslatedContent(translatedTexts);
// };


//   const translatePageContent = async (content, newLanguage) => {
//     const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
//     const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

//     const translatedTexts = {};

//     try {
//       // Loop through each key in the content and translate
//       for (const key in content) {
//         if (content.hasOwnProperty(key)) {
//           const response = await fetch(apiUrl, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               q: content[key],
//               target: newLanguage,
//             }),
//           });

//           if (response.ok) {
//             const data = await response.json();
//             translatedTexts[key] = data.data.translations[0].translatedText;
//           } else {
//             console.error(`Error with translation for ${key}: ${response.statusText}`);
//             translatedTexts[key] = content[key]; // Fallback to original text
//           }
//         }
//       }
      
//       return translatedTexts; // Return the translated texts
//     } catch (error) {
//       console.error('Error translating content:', error);
//       return content; // Fallback to original content in case of an error
//     }
//   };

//   return (
//     <LanguageContext.Provider value={{ language, translatedContent, switchLanguage }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };

// export const useLanguage = () => {
//   const context = useContext(LanguageContext);
//   if (!context) {
//     throw new Error("useLanguage must be used within a LanguageProvider");
//   }
//   return context;
// };



// 'use client';
// import React, { createContext, useState, useContext } from 'react';

// // Create the context
// const LanguageContext = createContext();

// // Custom hook to access language context
// export const useLanguage = () => useContext(LanguageContext);

// // Content to translate (default language: English)
// const defaultContent = {
//   sections: {
//     sizes: "Sizes",
//     sides: "Sides",
//     entrees: "Entrees",
//     appetizers: "Appetizers",
//     drinks: "Drinks",
//   },
//   title: "Menu",
//   buttonLabel: "Visual Aid",
// };

// // Language context provider
// export function LanguageProvider({ children }) {
//   const [languageContent, setLanguageContent] = useState(defaultContent);

//   const switchLanguage = async (targetLanguage) => {
//     const translatedTexts = {};
//     const content = defaultContent; // Base content to translate

//     console.log("Switching language. Target language:", targetLanguage);

//     for (const key in content) {
//       const value = content[key];

//       // Handle nested objects like "sections"
//       if (typeof value === "object") {
//         translatedTexts[key] = {};
//         for (const subKey in value) {
//           try {
//             const response = await fetch(
//               `https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY`,
//               {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                   q: value[subKey],
//                   target: targetLanguage,
//                   source: "en",
//                 }),
//               }
//             );

//             if (response.ok) {
//               const data = await response.json();
//               translatedTexts[key][subKey] = data.data.translations[0].translatedText;
//             } else {
//               console.error(
//                 `Error with translation for ${subKey}: ${response.status} - ${response.statusText}`
//               );
//               translatedTexts[key][subKey] = value[subKey]; // Fallback
//             }
//           } catch (err) {
//             console.error(`Error fetching translation for ${subKey}:`, err);
//             translatedTexts[key][subKey] = value[subKey] || "Translation unavailable"; // Fallback
//           }
//         }
//       } else {
//         // Handle top-level strings
//         try {
//           const response = await fetch(
//             `https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY`,
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 q: value,
//                 target: targetLanguage,
//                 source: "en",
//               }),
//             }
//           );

//           if (response.ok) {
//             const data = await response.json();
//             translatedTexts[key] = data.data.translations[0].translatedText;
//           } else {
//             console.error(
//               `Error with translation for ${key}: ${response.status} - ${response.statusText}`
//             );
//             translatedTexts[key] = value; // Fallback
//           }
//         } catch (err) {
//           console.error(`Error fetching translation for ${key}:`, err);
//           translatedTexts[key] = value || "Translation unavailable"; // Fallback
//         }
//       }
//     }

//     setLanguageContent(translatedTexts);
//     console.log("Updated language content:", translatedTexts);
//   };

//   return (
//     <LanguageContext.Provider value={{ translatedContent: languageContent, switchLanguage }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// }


"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const [translatedContent, setTranslatedContent] = useState({});
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;

  const content = {
    sizes: "Sizes",
    sides: "Sides",
    entrees: "Entrees",
    appetizers: "Appetizers",
    drinks: "Drinks",
  };

  const fetchTranslations = async () => {
    const translatedTexts = { ...content }; // Default to original content

    for (const key in content) {
      try {
        const response = await fetch(
          `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              q: content[key],
              target: language,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          translatedTexts[key] = data.data.translations[0].translatedText;
        } else {
          console.error(
            `Error with translation for ${key}: ${response.status} - ${response.statusText}`
          );
        }
      } catch (err) {
        console.error(`Translation API error for ${key}:`, err);
      }
    }

    setTranslatedContent(translatedTexts);
  };

  useEffect(() => {
    fetchTranslations();
  }, [language]);

  const switchLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ translatedContent, language, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
