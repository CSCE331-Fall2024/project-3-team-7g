"use client";

import Navbar from "../components/Navbar";
import ButtonList from "@/app/components/ButtonList";
import { useState , useEffect} from "react";
import { useRouter } from "next/navigation";
import changeText from "@/app/language";

const Bowl = () => {
    const [isAccessible, setIsAccessible] = useState(false);
    const toggleStyle = () => {
        setIsAccessible((prev) => !prev);
      };
    const [selectedItems, setSelectedItems] = useState({
        sides: [],
        entrees: [],
    });

    const router = useRouter();
    const [popupMessage, setPopupMessage] = useState("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    useEffect(() => {
        async function doTheThings() {
          const contentElement = document.getElementById("content");
          const textElements = contentElement.querySelectorAll('h1, h2, h3, label, button, td, th, .navbarLinks');
      
          // Collect text content to translate
          const textsToTranslate = Array.from(textElements).map((el) => el.innerText);
          console.log(textsToTranslate);
          const translatedTexts = await changeText("helmutrulrich@tamu.edu", textsToTranslate);
          
          //console.log(translatedTexts);
          // Apply translated text back to each element
          let index = 0;
          textElements.forEach((el) => {
            el.innerText = translatedTexts[index++];
          });
        }
        doTheThings();
        
      }, []);

    const handleItemClick = (listType, item) => {
        const maxSelections = {
            entrees: 1,
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

    const handleFinalize = async () => {
        const maxSelections = {
            entrees: 1,
            sides: 1,
        };

        const numEntreesSelected = selectedItems.entrees.length;
        const numSidesSelected = selectedItems.sides.length;

        if (numEntreesSelected < maxSelections.entrees || numSidesSelected < maxSelections.sides) {
            showPopup(
                `Need to select an ${numEntreesSelected < maxSelections.entrees ? 'entree' : ''}${numSidesSelected < maxSelections.sides ? ' and a side' : ''}.`
            );
            return;
        }

        try {
            for (const side of selectedItems.sides) {
                await addNormalItem("item", side);
            }

            for (const entree of selectedItems.entrees) {
                await addNormalItem("item", entree);
            }

            router.push(`/customerOrder/completeOrder`);
        } catch (error) {
            showPopup("An error occurred while finalizing your items.");
        }
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
        } catch (error) {
            showPopup("Error adding item to database.");
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
        <div className="relative flex flex-col min-h-screen bg-white" id = "content">
            <Navbar screen={"Choose 1 Side and 1 Entree"} />
            <main className="flex-grow flex flex-col p-4">
                <div className="flex justify-between mt-4 mr-4">
                    <h1 className="px-4 text-2xl font-bold">Sides</h1>
                    <button onClick={handleFinalize} className="px-6 py-3 text-white font-semibold rounded-lg">
                        Finalize
                    </button>
                </div>
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
                {<button
                    onClick={toggleStyle}
                    className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg font-bold"

                >
                    Visual Aid

                </button> }
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

export default Bowl;