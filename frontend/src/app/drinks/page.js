import ButtonList from "../components/ButtonList";
import Navbar from "../components/Navbar";
import OptionButton from "../components/OptionButton";

// Creates page and adds navbar. Adds the title and button list of entrees.
export default function Drinks() {

    return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow flex flex-col p-4 text-center">
        <h1 className="text-3xl font-bold">Drinks</h1>
        <ButtonList listType="drinks"></ButtonList>
      </main>
    </div>
    );
}