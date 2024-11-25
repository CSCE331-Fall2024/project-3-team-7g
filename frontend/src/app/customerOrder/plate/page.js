"use client";

import Navbar from "../components/Navbar";
import ButtonList from "@/app/components/ButtonList";
import { useState } from "react";

const Plate = () => {
    const [selectedItems, setSelectedItems] = useState({
        sides: [],
        entrees: [],
    });

    const [popupMessage, setPopupMessage] = useState("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const handleItemClick = (listType, item) => {
        const maxSelections = {
            entrees: 2,
            sides: 1,
        };

        setSelectedItems((prev) => {
            const isSelected = prev[listType].includes(item);
            const currentSelections = prev[listType];

            if (isSelected) {
                hidePopup();
                const updatedItems = currentSelections.filter((i) => i !== item);
                return {
                    ...prev,
                    [listType]: updatedItems,
                };
            }

            if (currentSelections.length < maxSelections[listType]) {
                hidePopup();
                return {
                    ...prev,
                    [listType]: [...currentSelections, item],
                };
            }

            showPopup(
                `You can only select up to ${maxSelections[listType]} ${listType}. Deselect an item to add another.`
            );
            return prev;
        });
    };

    const handleFinalize = () => {
        const maxSelections = {
            entrees: 2,
            sides: 1,
        };
    
        const numEntreesSelected = selectedItems.entrees.length;
        const numSidesSelected = selectedItems.sides.length;
    
        if (numEntreesSelected < maxSelections.entrees || numSidesSelected < maxSelections.sides) {
            showPopup(
                `Need to select more ${numEntreesSelected < maxSelections.entrees ? 'entrees' : ''} ${numSidesSelected < maxSelections.sides ? ' and sides' : ''}.`
            );
            return;
        }
        
        // add to normal item but sides first
        console.log("All selections are complete. Finalizing...");
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
            <Navbar screen={"Choose 1 Side and 2 Entrees"} />
            <main className="flex-grow flex flex-col p-4">
                <h1 className="px-4 text-2xl font-bold">Sides</h1>
                {/* <p className="px-4 text-sm text-gray-600">Choose a Side, or Get Half and Half</p> */}
                <ButtonList
                    listType="sides"
                    selectedItems={selectedItems.sides}
                    handleItemClick={handleItemClick}
                />
                <h1 className="px-4 text-2xl font-bold">Entrees</h1>
                <ButtonList
                    listType="entrees"
                    selectedItems={selectedItems.entrees}
                    handleItemClick={handleItemClick}
                />
                <div className="flex justify-end mt-4 mr-4">
                    <button onClick={handleFinalize} className="px-6 py-3 text-white font-semibold rounded-lg">
                        Finalize
                    </button>
                </div>
            </main>

            {isPopupVisible && (
                <div
                    style={{
                        position: "fixed",
                        top: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "16px",
                        backgroundColor: "#ffcccc",
                        color: "#d8000c",
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
};

export default Plate;