import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-[var(--navbar-bg)] text-[var(--navbar-text)] h-16 flex items-center justify-center">
      <ul className="flex justify-center space-x-8">
        <li>
          <Link href="/" className="hover:text-gray-400">Home</Link>
        </li>
        <li>
          <Link href="/entrees" className="hover:text-gray-400">Entrees</Link>
        </li>
        <li>
          <Link href="/sides" className="hover:text-gray-400">Sides</Link>
        </li>
        <li>
          <Link href="/appetizers" className="hover:text-gray-400">Appetizers</Link>
        </li>
        <li>
          <Link href="/drinks" className="hover:text-gray-400">Drinks</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;