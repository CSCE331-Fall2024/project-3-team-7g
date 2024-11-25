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

'use client';
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ButtonList from "../components/ButtonList";

export default function Menu() {
  const [isAccessible, setIsAccessible] = useState(false);

  const [menuPrices, setMenuPrices] = useState([]);
  const [error, setError] = useState(null);

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
        setError("Failed to fetch menu prices.");
      }
    }
    fetchMenuPrices();
  }, []);

  const sections = [
    { title: "Sizes", listType: "sizes" },
    { title: "Sides", listType: "sides" },
    { title: "Entrees", listType: "entrees" },
    { title: "Appetizers", listType: "Appetizer" },
    { title: "Drinks", listType: "Drink" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow flex flex-col p-4">
        {/* Prices Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">Prices</h1>
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
              <p className="text-center text-gray-500">Loading prices...</p>
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

        <button
          onClick={toggleStyle}
          className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg font-bold"
        >
          Visual Aid
        </button>
      </main>
    </div>
  );
}
