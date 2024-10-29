import Image from "next/image";
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to Panda Express!</h1>
        <Image
          src="/Panda-Express-Foods.jpg"
          alt="Panda Express Food Items"
          width={700}
          height={500}
          className="rounded-lg shadow-lg"
        />
      </main>
    </div>
  );
}