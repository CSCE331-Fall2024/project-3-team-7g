import Link from 'next/link';
import Image from "next/image";

//Creates a home page for when you sign into Panda Express.
export default function Home() {
    return (
    <div className="flex flex-col min-h-screen bg-[#ce123c] text-gray-900">
        <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-4xl font-bold text-white mb-8">Welcome to Panda Express!</h1>
            <Image
            src="/panda-express-logo.svg"
            alt="Panda Express Food Items"
            width={500}
            height={500}
            className="rounded-lg mb-10"
            />
            <Link href="menuBoard"> 
                <button className="px-6 py-3 text-white font-semibold rounded-lg homeScreenButton">
                    View Menu
                </button>
            </Link>
        </main>
    </div>
);
}