"use client";

import Navbar from "../components/Navbar";
import ButtonList from "@/app/components/ButtonList";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function bowl() {
    const [isAccessible, setIsAccessible] = useState(false);
    const toggleStyle = () => {
      setIsAccessible((prev) => !prev);
    };
    // const router = useRouter();
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemType, setItemType] = useState(null);
    // const size = router.query.size;
    // console.log(size);

    const handleItemClick = (itemType, item) => {
        setItemType(itemType);
        setSelectedItem(item);
    };


    useEffect(() => {
        if (selectedItem != '') {
            console.log(`Chose ${selectedItem}`);
        }
    }, [selectedItem]);

    return (
        <div className="relative flex flex-col min-h-screen bg-white">
            <Navbar screen={'Choose Items'}/>
            <main className="flex-grow flex flex-col p-4">
                <h1 className="px-4 text-2xl font-bold">Sides</h1>
                <ButtonList listType="sides" handleItemClick={handleItemClick} isAccessible={isAccessible}></ButtonList>
                <h1 className="px-4 text-2xl font-bold">Entrees</h1>
                <ButtonList listType="entrees" handleItemClick={handleItemClick} isAccessible={isAccessible}></ButtonList>
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