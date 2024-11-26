// "use client";

// import React from 'react';
// import { useLanguage } from '../LanguageContext'; // Adjust path accordingly

// const LanguageSelector = () => {
//   const { language, switchLanguage } = useLanguage();

//   const handleLanguageChange = async (e) => {
//     const selectedLanguage = e.target.value;

//     // Assuming switchLanguage handles making the API call
//     await switchLanguage(selectedLanguage);
//   };

//   return (
//     <div>
//       <label htmlFor="language">Translate to: </label>
//       <select id="language" value={language} onChange={handleLanguageChange}>
//         <option value="en">English</option>
//         <option value="es">Spanish</option>
//         <option value="fr">French</option>
//         <option value="de">German</option>
//       </select>
//     </div>
//   );
// };

// export default LanguageSelector;


"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import pageContent from "../pageContent"; // Import centralized content

const LanguageSelector = ({ pageKey }) => {
  const { language, switchLanguage } = useLanguage();

  const handleLanguageChange = async (e) => {
    const selectedLanguage = e.target.value;

    // Pass page-specific content dynamically
    const content = pageContent[pageKey] || {};
    await switchLanguage(selectedLanguage, content);
  };

  return (
    <div>
      <label htmlFor="language">Translate to: </label>
      <select id="language" value={language} onChange={handleLanguageChange}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
