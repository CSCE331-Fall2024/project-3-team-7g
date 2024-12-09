'use client';
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";


export default function Reports() {
  const [xReport, setXReport] = useState([]);  
  const [zReportTotal, setZReportTotal] = useState(null); 
  const [error, setError] = useState(null);

  
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");

  
  async function fetchXReport() {
    try {
      
      if (!month || !day || !year) {
        throw new Error("Please enter a valid date.");
      }

      
      const date = `${year}/${month.padStart(2, "0")}/${day.padStart(2, "0")}`;

      
      const xResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/Manager/getHourlySales/${date}`);
      if (!xResponse.ok) {
        throw new Error(`X Report fetch error! Status: ${xResponse.status}`);
      }
      const xData = await xResponse.json();
      setXReport(xData);
      setError(null);
    } catch (err) {
      console.error("Error fetching X Report:", err);
      setError(err.message || "Failed to fetch X Report. Please try again later.");
    }
  }

  
  async function handleZReport() {
    try {
      if (xReport.length === 0) {
        throw new Error("No X-Report data available to generate Z-Report.");
      }

      
      const totalSales = xReport.reduce((sum, record) => sum + record.totalSales, 0);

      
      setXReport([]);
      setZReportTotal(totalSales);
      setError(null);
    } catch (err) {
      console.error("Error generating Z Report:", err);
      setError(err.message || "Failed to generate Z Report. Please try again later.");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow flex flex-col p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Reports</h1>

        
        {error && (
          <p className="text-center text-red-500 font-bold mb-4">{error}</p>
        )}

        
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

        {/*X-Report*/}
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
            <p className="text-center text-gray-500">No X Report data available.</p>
          )}
        </div>

        {/* Z-Report*/}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-center mb-4">Z Report - Total Daily Sales</h2>
          {zReportTotal !== null ? (
            <p className="text-center text-lg font-bold">
              Total Sales: ${zReportTotal.toFixed(2)}
            </p>
          ) : (
            <p className="text-center text-gray-500">No Z Report data available.</p>
          )}
          <div className="flex justify-center mt-4">
          <button
            onClick={handleZReport}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 mt-4"
          >
            Generate Z Report
          </button>
          </div>
        </div>
      </main>
    </div>
  );
}
