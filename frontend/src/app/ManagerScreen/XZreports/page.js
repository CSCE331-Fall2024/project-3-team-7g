'use client';
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Reports() {
  const [xReport, setXReport] = useState([]); 
  const [zReport, setZReport] = useState([]); 
  const [error, setError] = useState(null);

  // Input states for the date form
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");

  // Fetch's X report
  async function fetchXReport() {
    try {
      if (!month || !day || !year) {
        throw new Error("Please enter a valid date.");
      }

      const date = `${year}/${month.padStart(2, "0")}/${day.padStart(2, "0")}`;
      const xResponse = await fetch(`http://localhost:3000/Manager/getHourlySales/${date}`);
      if (!xResponse.ok) {
        throw new Error(`X Report fetch error! Status: ${xResponse.status}`);
      }
      const xData = await xResponse.json();
      setXReport(xData);
      setError(null); 
    } catch (err) {
      console.error("Error fetching X Report:", err);
      setError(err.message || "Failed to fetch X Report. Please try again.");
    }
  }

  // Fetch's Z Report
  async function fetchZReport() {
    if (xReport.length === 0) {
      setError("X Report data is required before fetching the Z Report.");
      return;
    }

    try {
      const zResponse = await fetch("http://localhost:3000/Manager/getDailySales"); // Adjust the endpoint if needed
      if (!zResponse.ok) {
        throw new Error(`Z Report fetch error! Status: ${zResponse.status}`);
      }
      const zData = await zResponse.json();
      setZReport(zData);
      setXReport([]); // Clear X Report
      setError(null); 
    } catch (err) {
      console.error("Error fetching Z Report:", err);
      setError(err.message || "Failed to fetch Z Report. Please try again.");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow flex flex-col p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Reports</h1>

        
        {error && <p className="text-center text-red-500 font-bold mb-4">{error}</p>}

        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-center mb-4">Select Date for X Report</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchXReport();
            }}
            className="flex flex-col items-center"
          >
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                placeholder="MM"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded w-16 text-center"
                maxLength="2"
              />
              <input
                type="text"
                placeholder="DD"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded w-16 text-center"
                maxLength="2"
              />
              <input
                type="text"
                placeholder="YYYY"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded w-20 text-center"
                maxLength="4"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Fetch X Report
            </button>
          </form>
        </div>

       
        <div className="mb-8 text-center">
          <button
            onClick={fetchZReport}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            disabled={xReport.length === 0}
          >
            Fetch Z Report
          </button>
        </div>

        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-center mb-4">X Report - Hourly Sales</h2>
          {xReport.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300 text-left">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Hour</th>
                  <th className="border border-gray-300 px-4 py-2">Sales</th>
                </tr>
              </thead>
              <tbody>
                {xReport.map((sale, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{sale.hour}</td>
                    <td className="border border-gray-300 px-4 py-2">${sale.totalSalesFormatted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">Loading X Report...</p>
          )}
        </div>

        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-center mb-4">Z Report - Daily Sales</h2>
          {zReport.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300 text-left">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Sales</th>
                </tr>
              </thead>
              <tbody>
                {zReport.map((sale, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{sale.date}</td>
                    <td className="border border-gray-300 px-4 py-2">${sale.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">Loading Z Report...</p>
          )}
        </div>
      </main>
    </div>
  );
}
