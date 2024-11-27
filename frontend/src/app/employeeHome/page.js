"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const classification = localStorage.getItem("Classification");

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("Classification");

        router.push("/");
    };

    return (
        <div className="relative flex flex-col min-h-screen bg-[#4B4B4B]">
            <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-4xl font-bold text-white mb-8">
                    Welcome to Panda Express' Employee Dashboard!
                </h1>
                <Image
                    src="/panda-express-logo.svg"
                    alt="Panda Express Food Items"
                    width={500}
                    height={500}
                    className="rounded-lg mb-10"
                />
                <div className="flex space-evenly gap-4">
                    <Link href="">
                        <button className="px-6 py-3 text-white font-semibold rounded-lg">
                            Take Order
                        </button>
                    </Link>
                    {classification == 'Manager' && (
                        <Link href="ManagerScreen">
                            <button className="px-6 py-3 text-white font-semibold rounded-lg">
                                Manager View
                            </button>
                        </Link>
                    )}
                </div>

                <button className="px-6 py-3 text-white font-semibold rounded-lg mt-4" onClick={handleLogout}>
                    Log Out
                </button>
            </main>
        </div>
    );
}