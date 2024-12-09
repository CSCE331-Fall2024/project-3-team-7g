"use client";

import { useState, useEffect } from "react";
import Header from "./components/Navbar";

export default function UserManagement() {
  const [Users, setUsers] = useState([]);
  const [form, setForm] = useState({ user_id: "", name: "", email: "", classification: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_PORT + "/Manager/getUsers/");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const sortedData = data.sort((a, b) => a.user_id - b.user_id);
      
        setUsers(sortedData);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
      }
    }
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const changeClassification = async () => {
    try {
      const { user_id, classification } = form;

      if (!user_id || !classification) {
        setError("User ID and classification are required.");
        return;
      }

      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_PORT + "/Manager/changeClassification/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, classification }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result.message);

      setUsers((prevItems) =>
        prevItems.map((item) =>
            item.user_id === parseInt(user_id, 10)
                ? { ...item, classification: classification }
                : item
        )
    );
    

      setForm({ user_id: "", name: "", email: "", classification: "" });
      setError("");
    } catch (err) {
      setError("Failed to update classification");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-4">User Management</h1>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">User ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {Users.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{item.user_id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                <td className="border border-gray-300 px-4 py-2">{item.email}</td>
                <td className="border border-gray-300 px-4 py-2">{item.classification}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 p-4 border border-gray-300 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Change User Role</h2>
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <label>
              User ID:
              <input
                type="text"
                name="user_id"
                value={form.user_id}
                onChange={handleInputChange}
                className="block w-full p-2 border border-gray-300 rounded"
              />
            </label>
            <label>
              Role:
              <input
                type="text"
                name="classification"
                value={form.classification}
                onChange={handleInputChange}
                className="block w-full p-2 border border-gray-300 rounded"
              />
            </label>
          </div>
          <button
            onClick={changeClassification}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Update Role
          </button>
        </div>
      </div>
    </div>
  );
}
