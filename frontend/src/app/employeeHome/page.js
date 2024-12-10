// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function Home() {
//     const router = useRouter();
//     const classification = localStorage.getItem("Classification");

//     const handleLogout = () => {
//         localStorage.removeItem("userEmail");
//         localStorage.removeItem("userName");
//         localStorage.removeItem("Classification");

//         router.push("/");
//     };

//     return (
//         <div className="relative flex flex-col min-h-screen bg-[#ce123c]">
//             <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 text-center">
//             <h1 className="text-4xl font-bold text-white mb-8">
//                 Welcome to Panda Express&apos; Employee Dashboard!
//             </h1>

//                 <Image
//                     src="/panda-express-logo.svg"
//                     alt="Panda Express Food Items"
//                     width={500}
//                     height={500}
//                     className="rounded-lg mb-10"
//                 />
//                 <div className="flex space-evenly gap-4">
//                     <Link href="/employeeOrder">
//                         <button className="px-6 py-3 text-white bg-[#4B4B4B] font-semibold rounded-lg">
//                             Take Order
//                         </button>
//                     </Link>
//                     {classification == 'Manager' && (
//                         <Link href="ManagerScreen">
//                             <button className="px-6 py-3 text-white bg-[#4B4B4B] font-semibold rounded-lg">
//                                 Manager View
//                             </button>
//                         </Link>
//                     )}
//                 </div>

//                 <button className="px-6 py-3 text-white bg-[#4B4B4B] font-semibold rounded-lg mt-4" onClick={handleLogout}>
//                     Log Out
//                 </button>
//             </main>
//         </div>
//     );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
    const router = useRouter();
    const [classification, setClassification] = useState(null);

    // Use useEffect to access localStorage only on the client side
    useEffect(() => {
        const savedClassification = localStorage.getItem("Classification");
        setClassification(savedClassification);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("Classification");
        router.push("/");
    };

    const handleLanguageChange = async (e) => {
        const selectedLanguage = e.target.value;
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_PORT + '/language/changeLanguage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userEmail: localStorage.getItem("userEmail"),
                language: selectedLanguage
            }),
        });


      }

    return (
        <div className="relative flex flex-col min-h-screen bg-[#ce123c]">
            <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-4xl font-bold text-white mb-8">
                    Welcome to Panda Express&apos; Employee Dashboard!
                </h1>
                <select
                    onChange={handleLanguageChange}
                    className="hover:border-gray-400 focus:ring-2 pl-2 appearance-none mb-3 text-white bg-[#4B4B4B] border-gray-300 text-lg rounded"
                    
                >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="zh">Chinese</option>
                    <option value="de">German</option>
                </select>
                <div className="flex space-evenly gap-4">
                    <Link href="../employeeOrder">
                    <button className="px-6 py-3 text-white bg-[#4B4B4B] font-semibold rounded-lg">
                        Take Order
                    </button>
                    </Link>
                    {classification === 'Manager' && (
                        <Link href="../ManagerScreen">
                        <button className="px-6 py-3 text-white bg-[#4B4B4B] font-semibold rounded-lg">
                            Manager View
                        </button>
                        </Link>
                    )}
                </div>

                <button className="px-6 py-3 text-white bg-[#4B4B4B] font-semibold rounded-lg mt-4" onClick={handleLogout}>
                    Log Out
                </button>
            </main>
        </div>
    );
}
