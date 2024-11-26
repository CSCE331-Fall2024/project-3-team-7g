'use client';
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

export default function Menu() {
  const [isAccessible, setIsAccessible] = useState(false);

  const [menuPrices, setMenuPrices] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState(null);

  const toggleStyle = () => {
    setIsAccessible((prev) => !prev);
  };

  async function fetchMenuPrices() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/Manager/getMenuPrices/`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setMenuPrices(data);

    } catch (err) {
      console.error("Error fetching menu prices:", err);
      setError("Failed to fetch menu prices.");
    }
  }

  async function fetchMenuItems() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/Manager/getMenuItems/`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setMenuItems(data);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError("Failed to fetch menu items.");
    }
  }

  useEffect(() => {
    fetchMenuPrices();
    fetchMenuItems();
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
      <main className="flex-grow flex flex-wrap gap-4 p-4 bg-gray-50">
        <div className="flex-1 min-w-[250px] bg-gray-100 p-4 rounded-lg">
          <h1 className="text-3xl font-bold text-left mb-4">Prices</h1>
          <p className="text-md text-center bg-white p-2 rounded-lg my-1 shadow-sm">
            A La Carte: $
            {menuPrices.find((item) => item.name === "A La Carte")?.price ?? "Loading..."}
          </p>
          <p className="text-md text-center bg-white p-2 rounded-lg my-1 shadow-sm">
            Bowl: $
            {menuPrices.find((item) => item.name === "Bowl")?.price.toFixed(2) ?? "Loading..."}
          </p>
          <p className="text-md text-center bg-white p-2 rounded-lg my-1 shadow-sm">
            Plate: $
            {menuPrices.find((item) => item.name === "Plate")?.price.toFixed(2) ?? "Loading..."}
          </p>
          <p className="text-md text-center bg-white p-2 rounded-lg my-1 shadow-sm">
            Bigger Plate: $
            {menuPrices.find((item) => item.name === "Bigger Plate")?.price.toFixed(2) ?? "Loading..."}
          </p>
          <p className="text-md text-center bg-white p-2 rounded-lg my-1 shadow-sm">
            Drink: $
            {menuPrices.find((item) => item.name === "Drink")?.price.toFixed(2) ?? "Loading..."}
          </p>
          <p className="text-md text-center bg-white p-2 rounded-lg my-1 shadow-sm">
            Appetizer: $
            {menuPrices.find((item) => item.name === "Appetizer")?.price.toFixed(2) ?? "Loading..."}
          </p>
        </div>

        {["Entree", "Side", "Appetizer", "Drink"].map((section) => {
          const sectionItems = menuItems.filter((item) => item.type === section);

          return (
            <div key={section} className="flex-1 min-w-[250px] bg-gray-100 p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-left mb-4">{section}s</h1>
              <ul>
                {sectionItems.length > 0 ? (
                  sectionItems.map((item) => (
                    <li
                      key={item.id}
                      className="text-md text-center bg-white p-2 rounded-lg my-1 shadow-sm"
                    >
                      {item.name}
                    </li>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No items available.</p>
                )}
              </ul>
            </div>
          );
        })}
      </main>
    </div>
  );
}
