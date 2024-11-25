"use client";

import { useState } from "react";
import Header from "../components/Navbar";

export default function WeeklySales() {
    const [salesData, setSalesData] = useState([]);
    const [form, setForm] = useState({ year: "", month: "", day: "" });
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const fetchWeeklySales = async () => {
        try {
            const response = await fetch('http://localhost:3000/Manager/getWeeklySales/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(`HTTP error! Status: ${response.status}, ${data.message || ''}`);
            } else {
                setSalesData(data);
            }
        } catch (error) {
            setError("Failed to fetch weekly sales data.");
            console.error(error);
        }
    };

    const totalWeeklySales = salesData.reduce((sum, item) => sum + item.totalCost, 0);

    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-900">
            <Header />

            <div className="p-6">
                <h1 className="text-2xl font-bold text-center mb-4">Weekly Sales</h1>

                {/* Date Input Form */}
                <div className="mb-6 p-4 border border-gray-300 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Enter Start Date</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {["year", "month", "day"].map((field) => (
                            <div key={field} className="flex flex-col">
                                <label htmlFor={field}>
                                    {field.replace(/^\w/, (c) => c.toUpperCase())}
                                </label>
                                <input
                                    type="text"
                                    id={field}
                                    name={field}
                                    value={form[field]}
                                    onChange={handleInputChange}
                                    className="block w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={fetchWeeklySales}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Generate Report
                    </button>
                </div>
                {/* Total Weekly Sales */}
                <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                            <h3 className="text-xl font-bold">Total Weekly Sales:</h3>
                            <p className="text-lg font-semibold text-green-600">
                                ${totalWeeklySales.toFixed(2)}
                            </p>
                        </div>

                {/* Weekly Sales Table */}
                {salesData.length > 0 && (
                    <div>
                        <table className="w-full border-collapse border border-gray-300 mb-4">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Customer ID</th>
                                    <th className="border border-gray-300 px-4 py-2">Order ID</th>
                                    <th className="border border-gray-300 px-4 py-2">Time of Purchase</th>
                                    <th className="border border-gray-300 px-4 py-2">Total Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 px-4 py-2">{item.customerId}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.orderId}</td>
                                        <td className="border border-gray-300 px-4 py-2">{new Date(item.time).toLocaleString()}</td>
                                        <td className="border border-gray-300 px-4 py-2">${item.totalCost.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                )}
            </div>
        </div>
    );
}
