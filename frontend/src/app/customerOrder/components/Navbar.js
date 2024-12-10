"use client";

import { useRouter } from "next/navigation"; // Import from 'next/navigation' in the App Router
import React from "react";

function Navbar({ screen }) {
    const router = useRouter();

    const handleCancelOrder = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/purchasing/finalizePurchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: localStorage.getItem("userEmail"),
                    isActuallyOrdering: false,
                    cashOrCard: "Card",
                    timeOfPurchase: null
                }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            // Navigate to employee home page
            router.push("/employeeHome");
        } catch (error) {
            console.error("Failed to cancel the order:", error);
        }
    };

    return (
        <nav className="bg-[var(--navbar-bg)] text-[var(--navbar-text)] h-16 flex items-center justify-between px-8">
            <h1 className="text-3xl font-bold">{screen}</h1>
            <ul className="flex space-x-8">
                <li>
                    <button onClick={handleCancelOrder()} className="navbarLinks">
                        Home
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
