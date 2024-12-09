"use client";

import Navbar from "./components/Navbar";
import SimpleButtonList from "./components/SimpleButtonList";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
    const [isAccessible, setIsAccessible] = useState(false);
    const toggleStyle = () => {
        setIsAccessible((prev) => !prev);
    };

    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemType, setItemType] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

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
                    userEmail: localStorage.getItem("userEmail"),
                    type,
                    item: itemName
                }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            const responseData = await response.json();

            setSelectedItem(null);
            setItemType(null);

            showPopup(
                `Added ${itemName} to your cart!`
            );
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

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/purchasing/addToPurchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: localStorage.getItem("userEmail"),
                    type: "highItem",
                    item: sentItem
                }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            const responseData = await response.json();

            if (type == 'Appetizer' || type == 'Drink') {
                await addNormalItem("item", itemName);
            } else {
                if (itemName == 'A La Carte') {
                    router.push(`/employeeOrder/aLaCarte`);
                } else if (itemName == 'Bowl') {
                    router.push(`/employeeOrder/bowl`);
                } else if (itemName == 'Plate') {
                    router.push(`/employeeOrder/plate`);
                } else if (itemName == 'Bigger Plate') {
                    router.push(`/employeeOrder/biggerPlate`);
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

    const showPopup = (message) => {
        setPopupMessage(message);
        setIsPopupVisible(true);

        setTimeout(() => {
            setIsPopupVisible(false);
        }, 3000);
    };

    const hidePopup = () => {
        setPopupMessage("");
        setIsPopupVisible(false);
    };

    return (
        <div className="relative flex flex-col min-h-screen bg-white">
            <Navbar screen={'Begin Order'} />
            <main className="flex-grow flex flex-col p-4">
                <div className="flex justify-between mt-4 mr-4">
                    <h1 className="px-4 text-2xl font-bold">Sizes</h1>
                    <Link href="/employeeOrder/completeOrder">
                        <button className="px-6 py-3 text-white font-semibold rounded-lg">
                            Finalize Order
                        </button>
                    </Link>
                </div>
                <SimpleButtonList listType="sizes" handleItemClick={handleItemClick} isAccessible={isAccessible}></SimpleButtonList>
                <h1 className="px-4 text-2xl font-bold">Appetizers</h1>
                <SimpleButtonList listType="Appetizer" handleItemClick={handleItemClick} isAccessible={isAccessible}></SimpleButtonList>
                <h1 className="px-4 text-2xl font-bold">Drinks</h1>
                <SimpleButtonList listType="Drink" handleItemClick={handleItemClick} isAccessible={isAccessible}></SimpleButtonList>

                <button
                    onClick={toggleStyle}
                    className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg font-bold"

                >
                    Visual Aid

                </button>
            </main>
            {isPopupVisible && (
                <div
                    style={{
                        position: "fixed",
                        top: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "16px",
                        backgroundColor: "#DFF2BF",
                        color: "#4BB543",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        zIndex: 1000,
                        textAlign: "center",
                        width: "90%",
                        maxWidth: "400px",
                    }}
                >
                    {popupMessage}
                </div>
            )}
        </div>
    );
}