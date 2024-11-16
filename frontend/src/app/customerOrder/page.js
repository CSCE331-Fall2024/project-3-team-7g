"use client";

import Header from "./components/Navbar";
import ButtonList from "../components/ButtonList";
import { useEffect, useState } from "react";

export default function Home() {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    useEffect(() => {
        console.log(selectedItem);
    }, [selectedItem]);

    return (
        <div className="relative flex flex-col min-h-screen bg-white">
            <Header screen={'Begin Order'}/>
            <main className="flex-grow flex flex-col p-4">
                <h1 className="px-4 text-2xl font-bold">Sizes</h1>
                <ButtonList listType="sizes" handleItemClick={handleItemClick}></ButtonList>
                <h1 className="px-4 text-2xl font-bold">Appetizers</h1>
                <ButtonList listType="appetizers"></ButtonList>
                <h1 className="px-4 text-2xl font-bold">Drinks</h1>
                <ButtonList listType="drinks"></ButtonList>
            </main>
        </div>
    );
}