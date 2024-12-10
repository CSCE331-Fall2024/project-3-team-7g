"use client";

import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import changeText from "@/app/language";

const CompleteOrder = () => {
    const [popupMessage, setPopupMessage] = useState("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userEmail, setUserEmail] = useState(null);  // State to hold user email
    const [userName, setUserName] = useState(null);  // State to hold user name
    const router = useRouter();

    const showPopup = (message) => {
        setPopupMessage(message);
        setIsPopupVisible(true);

        setTimeout(() => {
            setIsPopupVisible(false);
        }, 3000);
    };

    const getOrderDetails = async () => {
        if (userEmail) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/purchasing/getOrderDetails/${userEmail}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch order details");
                }

                const data = await response.json();
                setOrderDetails(data);
            } catch (error) {
                showPopup("Error fetching order details. Please try again.");
            }
        }
    };

    useEffect(() => {
        // Only access localStorage client-side
        const email = localStorage.getItem("userEmail");
        const name = localStorage.getItem("userName");
        setUserEmail(email);
        setUserName(name);

            async function doTheThings() {
              const contentElement = document.getElementById("content");
              const textElements = contentElement.querySelectorAll('h1, h2, h3, label, button, td, th, .navbarLinks');
          
              // Collect text content to translate
              const textsToTranslate = Array.from(textElements).map((el) => el.innerText);
              console.log(textsToTranslate);
              const translatedTexts = await changeText(localStorage.getItem("userEmail"), textsToTranslate);
              
              //console.log(translatedTexts);
              // Apply translated text back to each element
              let index = 0;
              textElements.forEach((el) => {
                el.innerText = translatedTexts[index++];
              });
            }
            doTheThings();   
    }, []);

    useEffect(() => {
        if (userEmail) {
            getOrderDetails();
        }
    }, [userEmail]);

    const handleFinalize = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false); 
    };

    const handlePaymentOption = async (option) => {
        closeModal();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/purchasing/finalizePurchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: userEmail,
                    isActuallyOrdering: true,
                    cashOrCard: option
                }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            localStorage.removeItem("userEmail");
            localStorage.removeItem("userName");
            router.push("../");
            
            const responseData = await response.json();
        } catch (error) {
            console.log("Error finalizing order");
        }
    };

    return (
        <div className="relative flex flex-col min-h-screen bg-white" id = "content">
            <Navbar screen={"Current Order"} />
            <main className="flex-grow flex flex-col px-8 py-4">
                <h1 className="text-2xl font-bold mb-4">Hi, {userName}</h1>

                {orderDetails ? (
                    <div className="space-y-4">
                        <div>
                            <p className="text-lg font-semibold">Order Details</p>
                            <p className="text-lg font-semibold">Total: ${orderDetails.total.toFixed(2)}</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-2">Items</h2>
                            {orderDetails.highLevelItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-4 border rounded-lg shadow-sm bg-gray-100 mb-2"
                                >
                                    <p className="font-semibold">{item.Name}</p>
                                    {item["Side 1"] && <p>Side: {item["Side 1"]}</p>}
                                    {item["Entree 1"] && <p>Entree 1: {item["Entree 1"]}</p>}
                                    {item["Entree 2"] && <p>Entree 2: {item["Entree 2"]}</p>}
                                    {item["Entree 3"] && <p>Entree 3: {item["Entree 3"]}</p>}
                                    {item.Drink && <p>{item.Drink}</p>}
                                    {item.Appetizer && <p>{item.Appetizer}</p>}
                                    <p>Price: ${item.Price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Loading order details...</p>
                )}

                <div className="flex justify-center mt-4">
                    <Link href="/customerOrder">
                        <button className="px-6 py-3 text-white font-semibold rounded-lg mr-2">
                            Order More
                        </button>
                    </Link>
                    <button
                        onClick={handleFinalize}
                        className="px-6 py-3 text-white font-semibold rounded-lg ml-2"
                    >
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

            {isModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-sm">
                        <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
                        <div className="flex justify-center">
                            <button
                                onClick={() => handlePaymentOption("Cash")}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg mr-2"
                            >
                                Cash
                            </button>
                            <button
                                onClick={() => handlePaymentOption("Card")}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg ml-2"
                            >
                                Card
                            </button>
                        </div>
                        <button
                            onClick={closeModal}
                            className="mt-4 text-gray-500 underline bg-white hover:bg-white"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompleteOrder;
