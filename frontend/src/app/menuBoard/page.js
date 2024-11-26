// tab switching

// 'use client';
// import { useState } from "react";
// import Navbar from "./components/Navbar";
// import ButtonList from "../components/ButtonList";

// export default function Menu() {
//   const [currSection, setCurrSection] = useState("sides"); // Use state for tab switching
//   const [isAccessible, setIsAccessible] = useState(false);

//   const toggleStyle = () => {
//     setIsAccessible((prev) => !prev);
//   };

  
//   const sections = {

//     sides: { title: "Sides", listType: "sides" },
//     entrees: { title: "Entrees", listType: "entrees" },
//     appetizers: { title: "Appetizers", listType: "Appetizer" },
//     drinks: { title: "Drinks", listType: "Drink" },

//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-white text-gray-900">
//       <Navbar />
//       <main className="flex-grow flex flex-col p-4 text-center">
        
//         <div className="flex justify-center space-x-4 mb-4">
//           {Object.keys(sections).map((sectionKey) => (
//             <button

//               key={sectionKey}
//               onClick={() => setCurrSection(sectionKey)}
//               className={`px-4 py-2 font-bold rounded-lg ${
//                 currSection === sectionKey
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-300 text-gray-900"
//               }`}
              
//             >
//               {sections[sectionKey].title}
//             </button>
//           ))}
//         </div>

        
//         <h1 className="text-3xl font-bold">{sections[currSection].title}</h1>
//         <ButtonList
//           listType={sections[currSection].listType}
//           isAccessible={isAccessible}
//         />
//         <button
//           onClick={toggleStyle}
//           className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg font-bold"
//         >
//           Visual Aid
//         </button>
//       </main>
//     </div>
//   );
// }

// No tabs below ------------------------------------------------------------------------------------------------------------------------

// 'use client';
// import { useState, useEffect } from "react";
// import Navbar from "./components/Navbar";
// import ButtonList from "../components/ButtonList";

// export default function Menu() {
//   const [isAccessible, setIsAccessible] = useState(false);

//   const [menuPrices, setMenuPrices] = useState([]);
//   const [error, setError] = useState(null);

//   const toggleStyle = () => {
//     setIsAccessible((prev) => !prev);
//   };

  
//   useEffect(() => {
//     async function fetchMenuPrices() {
//       try {
//         const response = await fetch("http://localhost:3000/Manager/getMenuPrices/");

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         setMenuPrices(data);

//       } catch (err) {
//         console.error("Error fetching menu prices:", err);
//         setError("Failed to fetch menu prices.");
//       }
//     }
//     fetchMenuPrices();
//   }, []);

//   const sections = [
//     { title: "Sizes", listType: "sizes" },
//     { title: "Sides", listType: "sides" },
//     { title: "Entrees", listType: "entrees" },
//     { title: "Appetizers", listType: "Appetizer" },
//     { title: "Drinks", listType: "Drink" },
//   ];

//   return (
//     <div className="flex flex-col min-h-screen bg-white text-gray-900">
//       <Navbar />
//       <main className="flex-grow flex flex-col p-4">
//         {/* Prices Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-center mb-4">Prices</h1>
//           {error && <p className="text-red-500 text-center">{error}</p>}
//           <ul className="mt-2">
//             {menuPrices.length > 0 ? (
//               menuPrices.map((price, index) => (
//                 <li
//                   key={index}
//                   className="text-lg text-center bg-gray-100 p-2 rounded-lg my-1"
//                 >
//                   {price.name}: ${price.price.toFixed(2)}
//                 </li>
//               ))
//             ) : (
//               <p className="text-center text-gray-500">Loading prices...</p>
//             )}
//           </ul>
//         </div>

//         {/* Menu Sections */}
//         {sections.map((section) => (
//           <div key={section.title} className="mb-8">
//             <h1 className="text-3xl font-bold text-center mb-4">
//               {section.title}
//             </h1>
//             <ButtonList
//               listType={section.listType}
//               isAccessible={isAccessible}
//             />
//           </div>
//         ))}

//         <button
//           onClick={toggleStyle}
//           className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg font-bold"
//         >
//           Visual Aid
//         </button>
//       </main>
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect } from "react";
// import { useLanguage } from "../LanguageContext"; // Import LanguageContext
// import Navbar from "./components/Navbar";
// import ButtonList from "../components/ButtonList";
// import LanguageSelector from "../components/LanguageSelector";

// export default function Menu() {
//   const { translatedContent } = useLanguage(); // Access translations from context
//   const [isAccessible, setIsAccessible] = useState(false);
//   const [menuPrices, setMenuPrices] = useState([]);
//   const [error, setError] = useState(null);

//   // Toggle for Visual Aid
//   const toggleStyle = () => {
//     setIsAccessible((prev) => !prev);
//   };

//   useEffect(() => {
//     async function fetchMenuPrices() {
//       try {
//         const response = await fetch("http://localhost:3000/Manager/getMenuPrices/");
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         setMenuPrices(data);
//       } catch (err) {
//         console.error("Error fetching menu prices:", err);
//         setError("Failed to fetch menu prices.");
//       }
//     }
//     fetchMenuPrices();
//   }, []);

//   // Sections to display (translate dynamically)
//   const sections = [
//     { title: translatedContent?.sizes || "Sizes", listType: "sizes" },
//     { title: translatedContent?.sides || "Sides", listType: "sides" },
//     { title: translatedContent?.entrees || "Entrees", listType: "entrees" },
//     { title: translatedContent?.appetizers || "Appetizers", listType: "Appetizer" },
//     { title: translatedContent?.drinks || "Drinks", listType: "Drink" },
//   ];

//   return (
//     <div
//       className={`flex flex-col min-h-screen ${
//         isAccessible ? "bg-gray-100 text-xl" : "bg-white text-base"
//       } text-gray-900`}
//     >
//       <Navbar />
//       <main className="flex-grow flex flex-col p-4">
//         {/* Prices Section */}
//         <div className={`mb-8 ${isAccessible ? "p-6" : "p-4"}`}>
//           <h1 className="text-3xl font-bold text-center mb-4">
//             {translatedContent?.prices || "Prices"}
//           </h1>
//           {error && <p className="text-red-500 text-center">{error}</p>}
//           <ul className="mt-2">
//             {menuPrices.length > 0 ? (
//               menuPrices.map((price, index) => (
//                 <li
//                   key={index}
//                   className={`text-lg text-center ${
//                     isAccessible ? "bg-gray-200 p-4 rounded-xl" : "bg-gray-100 p-2 rounded-lg"
//                   } my-1`}
//                 >
//                   {price.name}: ${price.price.toFixed(2)}
//                 </li>
//               ))
//             ) : (
//               <p className="text-center text-gray-500">
//                 {translatedContent?.loading || "Loading prices..."}
//               </p>
//             )}
//           </ul>
//         </div>

//         {/* Menu Sections */}
//         {sections.map((section) => (
//           <div
//             key={section.title}
//             className={`mb-8 ${isAccessible ? "p-6" : "p-4"}`}
//           >
//             <h1 className="text-3xl font-bold text-center mb-4">
//               {section.title}
//             </h1>
//             <ButtonList
//               listType={section.listType}
//               isAccessible={isAccessible}
//             />
//           </div>
//         ))}

//         {/* Footer Buttons */}
//         <div className="fixed bottom-4 right-4 flex flex-col gap-2">
//           {/* Visual Aid Toggle */}
//           <button
//             onClick={toggleStyle}
//             className={`px-4 py-2 ${
//               isAccessible
//                 ? "bg-green-600 text-white"
//                 : "bg-blue-500 text-white"
//             } rounded-lg shadow-lg font-bold`}
//           >
//             {isAccessible ? translatedContent?.turnOffVisualAid || "Turn Off Visual Aid" : translatedContent?.visualAid || "Visual Aid"}
//           </button>

//           {/* Language Selector */}
//           <LanguageSelector />
//         </div>
//       </main>
//     </div>
//   );
// }



// 'use client';
// import { useState, useEffect } from "react";
// import Navbar from "./components/Navbar";
// import ButtonList from "../components/ButtonList";
// import { useLanguage } from "../LanguageContext";

// export default function Menu() {
//   const [isAccessible, setIsAccessible] = useState(false);
//   const [menuPrices, setMenuPrices] = useState([]);
//   const [error, setError] = useState(null);

//   const { translatedContent, switchLanguage } = useLanguage();

//   const toggleStyle = () => {
//     setIsAccessible((prev) => !prev);
//   };

//   useEffect(() => {
//     async function fetchMenuPrices() {
//       try {
//         const response = await fetch("http://localhost:3000/Manager/getMenuPrices/");
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         setMenuPrices(data);
//       } catch (err) {
//         console.error("Error fetching menu prices:", err);
//         setError("Failed to fetch menu prices.");
//       }
//     }
//     fetchMenuPrices();
//   }, []);

//   // Default content for fallback
//   const defaultContent = {
//     pricesTitle: "Prices",
//     loadingPrices: "Loading prices...",
//     failedFetch: "Failed to fetch menu prices.",
//     visualAidButton: "Visual Aid",
//     sections: {
//       sizes: "Sizes",
//       sides: "Sides",
//       entrees: "Entrees",
//       appetizers: "Appetizers",
//       drinks: "Drinks",
//     },
//   };

//   const content = translatedContent || defaultContent;
//   const { pricesTitle, loadingPrices, failedFetch, visualAidButton, sections } = content;

//   return (
//     <div className="flex flex-col min-h-screen bg-white text-gray-900">
//       <Navbar />
//       <main className="flex-grow flex flex-col p-4">
//         {/* Prices Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-center mb-4">
//             {pricesTitle}
//           </h1>
//           {error && <p className="text-red-500 text-center">{failedFetch}</p>}
//           <ul className="mt-2">
//             {menuPrices.length > 0 ? (
//               menuPrices.map((price, index) => (
//                 <li
//                   key={index}
//                   className="text-lg text-center bg-gray-100 p-2 rounded-lg my-1"
//                 >
//                   {price.name}: ${price.price.toFixed(2)}
//                 </li>
//               ))
//             ) : (
//               <p className="text-center text-gray-500">{loadingPrices}</p>
//             )}
//           </ul>
//         </div>

//         {/* Menu Sections */}
//         {sections &&
//           Object.entries(sections).map(([key, title]) => (
//             <div key={key} className="mb-8">
//               <h1 className="text-3xl font-bold text-center mb-4">{title}</h1>
//               <ButtonList listType={key} isAccessible={isAccessible} />
//             </div>
//           ))}

//         <button
//           onClick={() => switchLanguage("es", defaultContent)} // Example: Switch to Spanish
//           className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg font-bold"
//         >
//           {visualAidButton}
//         </button>
//       </main>
//     </div>
//   );
// }


'use client';
import { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import Navbar from "./components/Navbar";
import ButtonList from "../components/ButtonList";

export default function Menu() {
  const [isAccessible, setIsAccessible] = useState(false);
  const [menuPrices, setMenuPrices] = useState([]);
  const [error, setError] = useState(null);

  const { translatedContent, switchLanguage } = useLanguage();

  const toggleStyle = () => {
    setIsAccessible((prev) => !prev);
  };

  useEffect(() => {
    async function fetchMenuPrices() {
      try {
        const response = await fetch("http://localhost:3000/Manager/getMenuPrices/");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMenuPrices(data);
      } catch (err) {
        console.error("Error fetching menu prices:", err);
        setError(translatedContent.errorMessage || "Failed to fetch menu prices.");
      }
    }
    fetchMenuPrices();
  }, [translatedContent]);

  const sections = [
    { title: translatedContent.sizes || "Sizes", listType: "sizes" },
    { title: translatedContent.sides || "Sides", listType: "sides" },
    { title: translatedContent.entrees || "Entrees", listType: "entrees" },
    { title: translatedContent.appetizers || "Appetizers", listType: "Appetizer" },
    { title: translatedContent.drinks || "Drinks", listType: "Drink" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow flex flex-col p-4">
        {/* Prices Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">
            {translatedContent.prices || "Prices"}
          </h1>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <ul className="mt-2">
            {menuPrices.length > 0 ? (
              menuPrices.map((price, index) => (
                <li
                  key={index}
                  className="text-lg text-center bg-gray-100 p-2 rounded-lg my-1"
                >
                  {price.name}: ${price.price.toFixed(2)}
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">
                {translatedContent.loading || "Loading prices..."}
              </p>
            )}
          </ul>
        </div>

        {/* Menu Sections */}
        {sections.map((section) => (
          <div key={section.title} className="mb-8">
            <h1 className="text-3xl font-bold text-center mb-4">
              {section.title}
            </h1>
            <ButtonList
              listType={section.listType}
              isAccessible={isAccessible}
            />
          </div>
        ))}

        {/* Buttons Section */}
        <div className="fixed bottom-4 right-4 flex gap-2">
          <button
            onClick={toggleStyle}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg font-bold"
          >
            {translatedContent.visualAid || "Visual Aid"}
          </button>
          <button
            onClick={() => switchLanguage()}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg font-bold"
          >
            {translatedContent.languageSwitcher || "Language"}
          </button>
        </div>
      </main>
    </div>
  );
}
