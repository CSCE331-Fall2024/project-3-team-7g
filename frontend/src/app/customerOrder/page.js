"use client";

import Header from "./components/Navbar";
import ButtonList from "../components/ButtonList";
import { useEffect, useState } from "react";

export default function Home() {
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemType, setItemType] = useState(null);

    const handleItemClick = (itemType, item) => {
        setItemType(itemType);
        setSelectedItem(item);
    };

    useEffect(() => {
        console.log(`Item type is ${itemType}; Actual item is: ${selectedItem}`);
    }, [selectedItem]);

    return (
        <div className="relative flex flex-col min-h-screen bg-white">
            <Header screen={'Begin Order'}/>
            <main className="flex-grow flex flex-col p-4">
                <h1 className="px-4 text-2xl font-bold">Sizes</h1>
                <ButtonList listType="sizes" handleItemClick={handleItemClick}></ButtonList>
                <h1 className="px-4 text-2xl font-bold">Appetizers</h1>
                <ButtonList listType="appetizers" handleItemClick={handleItemClick}></ButtonList>
                <h1 className="px-4 text-2xl font-bold">Drinks</h1>
                <ButtonList listType="drinks" handleItemClick={handleItemClick}></ButtonList>
            </main>
        </div>
    );
}