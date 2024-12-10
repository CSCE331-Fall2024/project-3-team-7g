"use client";

import { useState , useEffect} from "react";
import Header from "../components/Navbar";
import changeText from "@/app/language";

export default function ProductUsage() {
  const [usageData, setUsageData] = useState([]);
  const [form, setForm] = useState({
    startYear: "",
    startMonth: "",
    startDay: "",
    startHour: "",
    endYear: "",
    endMonth: "",
    endDay: "",
    endHour: "",
  });

  useEffect(() => {
    async function doTheThings() {
      const contentElement = document.getElementById("content");
      const textElements = contentElement.querySelectorAll('h1, h2, h3, label, button, td, th, .navbarLinks');
  
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

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const fetchUsageData = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_PORT + '/Manager/getUsageData/', {
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
        setUsageData(data);
      }
    } catch (error) {
      setError("Failed to fetch usage data.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900" id = "content">
      <Header />

      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Product Usage</h1>

        {/* Date Input Form */}
        <div className="mb-6 p-4 border border-gray-300 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Enter Date Range</h2>
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {["startYear", "startMonth", "startDay", "startHour", "endYear", "endMonth", "endDay", "endHour"].map((field) => (
              <div key={field} className="flex flex-col">
                <label htmlFor={field}>
                  {field.replace(/([A-Z])/g, ' $1').replace(/\b\w/g, (char) => char.toUpperCase())}
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
            onClick={fetchUsageData}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Generate Chart
          </button>
        </div>

        {/* Usage Data Table */}
        {usageData.length > 0 && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Item ID</th>
                <th className="border border-gray-300 px-4 py-2">Item Name</th>
                <th className="border border-gray-300 px-4 py-2">Amount Used</th>
              </tr>
            </thead>
            <tbody>
              {usageData.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.total_usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
