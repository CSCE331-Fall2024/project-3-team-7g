"use client";

import Navbar from "../menuBoard/components/Navbar";
import ButtonList from "../components/ButtonList";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [isAccessible, setIsAccessible] = useState(false);
    const toggleStyle = () => {
      setIsAccessible((prev) => !prev);
    };
    
    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemType, setItemType] = useState(null);

    const handleItemClick = (itemType, item) => {
        setItemType(itemType);
        setSelectedItem(item);
    };

    const addHighLevelItem = async (type, itemName) => {
        try {
            // await fetch(`${import.meta.env.NEXT_PUBLIC_BACKEND_PORT}`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //     })
            // });
            if (type == 'Appetizer' || type == 'Drink') {
                console.log(`Adding ${itemName} to cart`);

            } else {
                console.log(`You are now ordering a ${itemType}, redirecting you to the entree and side screen`);
                if (itemName == 'A La Carte') {
                    router.push(`/customerOrder/aLaCarte`);
                } else if (itemName == 'Bowl') {
                    router.push(`/customerOrder/bowl`);
                } else if (itemName == 'Plate') {
                    router.push(`/customerOrder/plate`);
                } else if (itemName == 'Bigger Plate') {
                    router.push(`/customerOrder/biggerPlate`);
                }
                // router.push({
                //     pathname: '/customerOrder/entreesAndSides',
                //     query: { size: encodeURIComponent(itemType) },
                // });
                // router.push('/customerOrder/entreesAndSides');
                
            }
        } catch (error) {
            console.log("Error adding high level item to database")
        }
    };

    useEffect(() => {
        if (selectedItem != null) {
            addHighLevelItem(itemType, selectedItem);
        }
    }, [selectedItem]);

    return (
        <div className="relative flex flex-col min-h-screen bg-white">
            <Navbar screen={'Begin Order'}/>
            <main className="flex-grow flex flex-col p-4">
                <h1 className="px-4 text-2xl font-bold">Sizes</h1>
                <ButtonList listType="sizes" handleItemClick={handleItemClick} isAccessible={isAccessible}></ButtonList>
                <h1 className="px-4 text-2xl font-bold">Appetizers</h1>
                <ButtonList listType="Appetizer" handleItemClick={handleItemClick} isAccessible={isAccessible}></ButtonList>
                <h1 className="px-4 text-2xl font-bold">Drinks</h1>
                <ButtonList listType="Drink" handleItemClick={handleItemClick} isAccessible={isAccessible}></ButtonList>
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