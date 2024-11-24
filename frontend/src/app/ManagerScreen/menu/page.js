"use client";


import { useState, useEffect } from "react";
import Header from "../components/Navbar";

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState({ id: "", name: "", type: "" });
  const [error, setError] = useState("");

  // Fetch menu items from the backend
  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const response = await fetch("http://localhost:3000/Manager/getMenuItems/");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError("Failed to fetch menu items.");
      }
    }
    fetchMenuItems();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Add new menu item
  const addMenuItem = async () => {
    try {
      const { id, name, type } = form;

      // Validation to ensure all fields are filled
      if (!id || !name || !type) {
        setError("All fields are required.");
        return;
      }

      const response = await fetch("http://localhost:3000/Manager/addMenuItem/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parseInt(id),
          itemName: name,
          itemType: type,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      // Update menu items state with the new item
      setMenuItems([...menuItems, { id, name, type }]);
      setForm({ id: "", name: "", type: "" });
      setError("");
      console.log(result.message); 
    } catch (err) {
      setError("Failed to add menu item.");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Header />
  
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Menu Management</h1>
  
        {/* Menu Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Item ID</th>
              <th className="border border-gray-300 px-4 py-2">Item Name</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                <td className="border border-gray-300 px-4 py-2">{item.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {/* Add Menu Item Form */}
        <div className="mt-6 p-4 border border-gray-300 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Add New Menu Item</h2>
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <label>
              ID:
              <input
                type="text"
                name="id"
                value={form.id}
                onChange={handleInputChange}
                className="block w-full p-2 border border-gray-300 rounded"
              />
            </label>
            <label>
              Item Name:
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="block w-full p-2 border border-gray-300 rounded"
              />
            </label>
            <label>
              Category:
              <input
                type="text"
                name="type"
                value={form.type}
                onChange={handleInputChange}
                className="block w-full p-2 border border-gray-300 rounded"
              />
            </label>
          </div>
          <button
            onClick={addMenuItem}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Menu Item
          </button>
        </div>
      </div>
    </div>
  );
}
