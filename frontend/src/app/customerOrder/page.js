"use client";

import Navbar from "../menuBoard/components/Navbar";
import ButtonList from "../components/ButtonList";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemType, setItemType] = useState(null);

    const handleItemClick = (itemType, item) => {
        setItemType(itemType);
        setSelectedItem(item);
    };

    const addNormalItem = async (type, itemName) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/purchasing/addToPurchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type,
                    item: itemName,
                }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }
    
            const responseData = await response.json();
    
            console.log('Response JSON:', responseData);
        } catch (error) {
            console.log("Error adding item to database")
        }
    }

    const addHighLevelItem = async (type, itemName) => {
        let sentItem;
        if (type == 'Appetizer' || type == 'Drink') {
            sentItem = type;
        } else {
            sentItem = itemName;
        }

        console.log(sentItem);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/purchasing/addToPurchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: "highItem",
                    item: sentItem,
                }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }
    
            const responseData = await response.json();
    
            console.log('Response JSON:', responseData);
            
            if (type == 'Appetizer' || type == 'Drink') {
                console.log(`type is ${type}`);
                await addNormalItem("item", itemName);
            } else {
                console.log(`You are now ordering a ${itemName}, redirecting you to the entree and side screen`);
                if (itemName == 'A La Carte') {
                    router.push(`/customerOrder/aLaCarte`);
                } else if (itemName == 'Bowl') {
                    router.push(`/customerOrder/bowl`);
                } else if (itemName == 'Plate') {
                    router.push(`/customerOrder/plate`);
                } else if (itemName == 'Bigger Plate') {
                    router.push(`/customerOrder/biggerPlate`);
                }
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
                <ButtonList listType="sizes" handleItemClick={handleItemClick}></ButtonList>
                <h1 className="px-4 text-2xl font-bold">Appetizers</h1>
                <ButtonList listType="Appetizer" handleItemClick={handleItemClick}></ButtonList>
                <h1 className="px-4 text-2xl font-bold">Drinks</h1>
                <ButtonList listType="Drink" handleItemClick={handleItemClick}></ButtonList>
            </main>
        </div>
    );
}