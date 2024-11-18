import Link from 'next/link';
import Image from "next/image";

export default function Home() {
    return (
    <div className="relative flex flex-col min-h-screen bg-[#ce123c]">
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute min-w-full min-h-full object-cover"
            >
                <source src="/panda_cooking.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>

        <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-4xl font-bold text-white mb-8">Welcome to Panda Express!</h1>
            <Image
                src="/panda-express-logo.svg"
                alt="Panda Express Food Items"
                width={500}
                height={500}
                className="rounded-lg mb-10"
            />
            <div className="flex justify-center items-center w-full max-w-3xl space-x-4">
                <Link href="menuBoard"> 
                    <button className="px-6 py-3 mr-4 text-white font-semibold rounded-lg">
                        View Menu
                    </button>
                </Link>
                <Link href="customerOrder"> 
                    <button className="px-6 py-3 text-white font-semibold rounded-lg">
                        Order
                    </button>
                </Link>
                <Link href="ManagerScreen"> 
                    <button className="px-6 py-3 text-white font-semibold rounded-lg">
                        Manager
                    </button>
                </Link>
            </div>
        </main>
    </div>
    );
}