"use client";
import ButtonList from "../components/ButtonList";
import Navbar from "../components/Navbar";
import OptionButton from "../components/OptionButton";
import { useState } from 'react';

// Creates page and adds navbar. Adds the title and button list of entrees.
export default function Entrees() {
  
    const [isAccessible, setIsAccessible] = useState(false);

    const toggleStyle = () => {
      setIsAccessible((prev) => !prev);
    };
    return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow flex flex-col p-4 text-center">
        <h1 className="text-3xl font-bold">Entrees</h1>
        <ButtonList listType="entrees"></ButtonList>
        <button
          onClick={toggleStyle}
          style={{
              padding: '10px 20px',
              marginBottom: '20px',
              backgroundColor: '#007bff',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '1rem',
          }}
        >


        </button>
      </main>
    </div>
    );
}