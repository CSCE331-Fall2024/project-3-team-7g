'use client';
import { useState } from "react";
import ButtonList from "../../components/ButtonList";
import Navbar from "../components/Navbar";

// Creates page and adds navbar. Adds the title and button list of entrees.
export default function Drinks() {
  const [isAccessible, setIsAccessible] = useState(false);
  const toggleStyle = () => {
    setIsAccessible((prev) => !prev);
  };
  
    return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow flex flex-col p-4 text-center">
        <h1 className="text-3xl font-bold">Entrees</h1>

        <ButtonList listType="drinks" isAccessible={isAccessible}></ButtonList>
        <button
          onClick={toggleStyle}
          className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg font-bold"
        
        >
          Accessibility help

        </button>
      </main>
    </div>
    );
}