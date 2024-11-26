"use client"; // Add this to the top of your file

import React, { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default to English
  const [translatedContent, setTranslatedContent] = useState({});

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en'; // Default to English if not set
    setLanguage(savedLanguage);
  }, []);

  const switchLanguage = async (newLanguage, pageContent) => {
    if (newLanguage === language) return;

    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);

    // Translate page content using Google Translate API
    const translatedTexts = await translatePageContent(pageContent, newLanguage);
    setTranslatedContent(translatedTexts);
  };

  const translatePageContent = async (content, newLanguage) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
    const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    const translatedTexts = {};

    try {
      // Loop through each key in the content and translate
      for (const key in content) {
        if (content.hasOwnProperty(key)) {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              q: content[key],
              target: newLanguage,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            translatedTexts[key] = data.data.translations[0].translatedText;
          } else {
            console.error(`Error with translation for ${key}: ${response.statusText}`);
            translatedTexts[key] = content[key]; // Fallback to original text
          }
        }
      }
      
      return translatedTexts; // Return the translated texts
    } catch (error) {
      console.error('Error translating content:', error);
      return content; // Fallback to original content in case of an error
    }
  };

  return (
    <LanguageContext.Provider value={{ language, translatedContent, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};



// "use client";

// import React, { createContext, useState, useEffect, useContext } from 'react';

// const LanguageContext = createContext();

// export const LanguageProvider = ({ children }) => {
//   const [language, setLanguage] = useState('en'); // Default to English
//   const [translatedContent, setTranslatedContent] = useState({});
//   const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;

//   // Load the language preference from localStorage on first render
//   useEffect(() => {
//     const storedLanguage = localStorage.getItem('language') || 'en';
//     setLanguage(storedLanguage);
//   }, []);

//   const translatePageContent = async (content, targetLanguage) => {
//     try {
//       const response = await fetch(
//         `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             q: content, // Array of strings or a single string to translate
//             target: targetLanguage,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Translation failed: ${response.statusText}`);
//       }

//       const data = await response.json();
//       const translatedTexts = data.data.translations.map((t) => t.translatedText);

//       return translatedTexts; // Return the translated texts
//     } catch (error) {
//       console.error('Error translating content:', error);
//       return content; // Fallback to original content in case of an error
//     }
//   };

//   const switchLanguage = async (newLanguage, pageContent) => {
//     if (newLanguage === language) return;

//     setLanguage(newLanguage);
//     localStorage.setItem('language', newLanguage);

//     // Translate page content using Google Translate API
//     const translatedTexts = await translatePageContent(pageContent, newLanguage);
//     setTranslatedContent(translatedTexts);
//   };

//   return (
//     <LanguageContext.Provider value={{ language, translatedContent, switchLanguage }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };

// export const useLanguage = () => useContext(LanguageContext);
