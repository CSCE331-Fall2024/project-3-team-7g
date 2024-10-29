import Navbar from "../components/Navbar";
import OptionButton from "../components/OptionButton";

export default function Entrees() {
    const entreeOptions = ["honey-walnut-shrimp.png", "beijing-beef.png", "broccoli-beef.png", "black-pepper.png", "beyond-original-orange-chicken.png", "grilled-teriyaki-chicken.png", "kung-pao-chicken.png", "mushroom-chicken.png", "orange-chicken.png", "honey-sesame-chicken-breast.png", "string-bean-chicken-breast.png", "sweet-fire-chicken.png", "hot-ones-chicken"];

    return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow flex flex-col p-4 text-center">
        <h1 className="text-3xl font-bold">Entrees</h1>
        <div>
          {entreeOptions.map((label, index) => (
            <OptionButton OptionName={label} >{index}</OptionButton>
          ))}
        </div>
      </main>
    </div>
    );
}