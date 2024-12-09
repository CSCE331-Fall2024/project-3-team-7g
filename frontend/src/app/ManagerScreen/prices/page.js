"use client";


import { useState, useEffect } from "react";
import Header from "../components/Navbar";

export default function PriceManagement() {
    const [menuItems, setMenuPrices] = useState([]);
    const [form, setForm] = useState({ id: "", name: "", price: "" });
    const [error, setError] = useState("");
  
    useEffect(() => {
      async function fetchMenuPrices() {
        try {
          const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_PORT + "/Manager/getMenuPrices/");
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
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
    };
  
    const changeMenuPrice = async () => {
        try {
          const { id, name, price } = form;
      
          // Validation to ensure all fields are filled
          if (!id || !name || !price) {
            setError("All fields are required.");
            return;
          }
      
          const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_PORT + "/Manager/updateMenuPricing/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: parseInt(id),
                price: parseFloat(price),
              }),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const result = await response.json();
      
          // Update the existing item's price in the state
          setMenuPrices((prevItems) =>
            prevItems.map((item) =>
              item.id === parseInt(id)
                ? { ...item, price: parseFloat(price) }
                : item
            )
          );
      
          setForm({ id: "", name: "", price: "" });
          setError("");
          console.log(result.message);
        } catch (err) {
          setError("Failed to update item price.");
          console.error(err);
        }
      };

    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-900">
          <Header />
      
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-4">Price Management</h1>
      
            {/* Menu Table */}
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Item ID</th>
                  <th className="border border-gray-300 px-4 py-2">Item Name</th>
                  <th className="border border-gray-300 px-4 py-2">Item Price</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
      
            {/* Change Menu Price Form */}
            <div className="mt-6 p-4 border border-gray-300 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Update Item Price</h2>
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
                  New Price:
                  <input
                    type="text"
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    className="block w-full p-2 border border-gray-300 rounded"
                  />
                </label>
              </div>
              <button
                onClick={changeMenuPrice}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Change Price
              </button>
            </div>
          </div>
        </div>
      );
    }
    