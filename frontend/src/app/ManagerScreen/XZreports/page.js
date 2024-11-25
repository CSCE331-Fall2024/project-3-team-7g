"use client";

import React, { useState, useEffect } from 'react';
import Header from "../components/Navbar";
//import './ReportsPage.css'; // Assuming you want to style this separately
//import Button from './OptionButton'; // Reuse button component if needed

export default function ReportsPage(){
    const [xReport, setXReport] = useState([]);
  const [zReport, setZReport] = useState([]);

  useEffect(() => {
    // Fetch X Report Data (Hourly Sales)
    fetch('/api/getHourlySales') // Adjust the endpoint if needed
      .then(response => response.json())
      .then(data => setXReport(data))
      .catch(err => console.error('Error fetching X Report:', err));

    // Fetch Z Report Data (Daily Sales or Totals)
    fetch('/api/getDailySales') // Adjust the endpoint if needed
      .then(response => response.json())
      .then(data => setZReport(data))
      .catch(err => console.error('Error fetching Z Report:', err));
  }, []);

  return (
    <div className="reports-page">
      <h1>Reports</h1>

      <div className="report-section">
        <h2>X Report</h2>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Sales</th>
            </tr>
          </thead>
          <tbody>
            {xReport.map((entry, index) => (
              <tr key={index}>
                <td>{entry.time}</td>
                <td>{entry.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="report-section">
        <h2>Z Report</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {zReport.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.totalSales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



