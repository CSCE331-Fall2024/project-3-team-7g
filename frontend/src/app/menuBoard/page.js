import ButtonList from "./components/ButtonList";
import Navbar from "./components/Navbar";

export default function Sizes() {
  
    return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow flex flex-col p-4 text-center">
        <h1 className="text-3xl font-bold">Sizes</h1>
        <ButtonList listType="sizes"></ButtonList>
      </main>
    </div>
    );
}