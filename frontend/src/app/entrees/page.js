import Navbar from "../components/Navbar";
import OptionButton from "../components/OptionButton";

export default function Entrees() {
    return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow flex flex-col p-4 text-center">
        <h1 className="text-3xl font-bold">Entrees</h1>
        <OptionButton>Orange Chicken</OptionButton>
      </main>
    </div>
    );
}