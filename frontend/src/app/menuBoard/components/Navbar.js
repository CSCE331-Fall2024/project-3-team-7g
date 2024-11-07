import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-[var(--navbar-bg)] text-[var(--navbar-text)] h-16 flex items-center justify-between px-8">
      <ul className="flex space-x-8">
        <li>
          <Link href="/" className="navbarLinks">Home</Link>
        </li>
      </ul>
      <ul className="flex space-x-8">
        <li>
          <Link href="/menuBoard" className="navbarLinks">Sizes</Link>
        </li>
        <li>
          <Link href="/menuBoard/entrees" className="navbarLinks">Entrees</Link>
        </li>
        <li>
          <Link href="/menuBoard/sides" className="navbarLinks">Sides</Link>
        </li>
        <li>
          <Link href="/menuBoard/appetizers" className="navbarLinks">Appetizers</Link>
        </li>
        <li>
          <Link href="/menuBoard/drinks" className="navbarLinks">Drinks</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;