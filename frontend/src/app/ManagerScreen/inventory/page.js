"use client";


import { useState, useEffect } from "react";
import Header from "../components/Navbar";
import changeText from "@/app/language";

export default function InventoryManagement() {
    const [menuItems, setInventory] = useState([]);
    const [form, setForm] = useState({ id: "", name: "", amount: "" });
    const [error, setError] = useState("");
  
    useEffect(() => {
        async function fetchItemInventory() {
          try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_PORT + "/Manager/getItemInventory/");
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
      
            // Sort inventory by id
            const sortedData = data.sort((a, b) => a.id - b.id);
      
            setInventory(sortedData);
          } catch (err) {
            console.error("Error fetching inventory:", err);
            setError("Failed to fetch inventory.");
          }
        }
        fetchItemInventory();

        async function doTheThings() {
          const contentElement = document.getElementById("content");
          const textElements = contentElement.querySelectorAll('h1, h2, h3, button, tb, td, th, .navbarLinks');
      
          // Collect text content to translate
          const textsToTranslate = Array.from(textElements).map((el) => el.innerText);
          console.log(textsToTranslate);
          const translatedTexts = await changeText(localStorage.getItem("userEmail"), textsToTranslate);
          
          //console.log(translatedTexts);
          // Apply translated text back to each element
          let index = 0;
          textElements.forEach((el) => {
            el.innerText = translatedTexts[index++];
          });
        }
        doTheThings();
      }, []);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
    };
  
    const addInventoryAmount = async () => {
        try {
          const { id, name, amount } = form;
      
          // Validation to ensure all fields are filled
          if (!id || !name || !amount) {
            setError("All fields are required.");
            return;
          }
      
          const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_PORT + "/Manager/addQuantity/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                amount: amount,
              }),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const result = await response.json();
          console.log(result.message);
    
          // Update the inventory state to reflect the new amount
          setInventory((prevItems) =>
            prevItems.map((item) =>
              item.id === parseInt(id, 10)
                ? { ...item, amount: (item.amount + parseInt(amount)) }
                : item
            )
          );
    
          // Clear the form and error state
          setForm({ id: "", name: "", amount: "" });
          setError("");
        } catch (err) {
          setError("Failed to update item amount.");
          console.error(err);
        }
      };

    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-900" id = "content">
          <Header />
      
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-4">Inventory Management</h1>
      
            {/* Menu Table */}
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Item ID</th>
                  <th className="border border-gray-300 px-4 py-2">Item Name</th>
                  <th className="border border-gray-300 px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
      
            {/* Change inventory Form */}
            <div className="mt-6 p-4 border border-gray-300 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Add Item Quantity</h2>
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
                  Amount to Add:
                  <input
                    type="text"
                    name="amount"
                    value={form.amount}
                    onChange={handleInputChange}
                    className="block w-full p-2 border border-gray-300 rounded"
                  />
                </label>
              </div>
              <button
                onClick={addInventoryAmount}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add Amount
              </button>
            </div>
          </div>
        </div>
      );
    }
    