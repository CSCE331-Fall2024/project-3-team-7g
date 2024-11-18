"use client";

import Header from "./components/Navbar";

export default function Home() {
    return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Header />
      <main className="flex-grow flex flex-col p-4 text-center">
      </main>
    </div>
    );
}