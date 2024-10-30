import Navbar from "../components/Navbar";
import OptionButton from "../components/OptionButton";
import ButtonList from "../components/ButtonList";

// Creates page and adds navbar. Adds the title and button list of entrees.
export default function Sides() {
    return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow flex flex-col p-4 text-center">
        <h1 className="text-3xl font-bold">Sides</h1>
        <ButtonList listType="sides"></ButtonList>
      </main>
    </div>
    );
}