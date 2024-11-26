'use client';
import { useState } from "react";
import Navbar from "../components/Navbar";
import OptionButton from "../../components/OptionButton";
import ButtonList from "../../components/ButtonList";

// Creates page and adds navbar. Adds the title and button list of entrees.
export default function Sides() {
  const [isAccessible, setIsAccessible] = useState(false);
  const toggleStyle = () => {
    setIsAccessible((prev) => !prev);
  };
  
    return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow flex flex-col p-4 text-center">
        <h1 className="text-3xl font-bold">Sides</h1>

        <ButtonList listType="sides" isAccessible={isAccessible}></ButtonList>
        <button
          onClick={toggleStyle}
          className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg font-bold"
        
        >
          Visual Aid

        </button>
      </main>
    </div>
    );
}