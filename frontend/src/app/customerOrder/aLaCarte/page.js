"use client";

import Navbar from "../components/Navbar";
import ButtonList from "@/app/components/ButtonList";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function aLaCarte() {
    // const router = useRouter();
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemType, setItemType] = useState(null);
    // const size = router.query.size;

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
            <Navbar screen={'Choose Entree'}/>
            <main className="flex-grow flex flex-col p-4">
                <h1 className="px-4 text-2xl font-bold">Entrees</h1>
                <ButtonList listType="entrees" handleItemClick={handleItemClick}></ButtonList>
            </main>
        </div>
    );
}