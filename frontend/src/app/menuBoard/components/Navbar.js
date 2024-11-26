import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-[var(--navbar-bg)] text-[var(--navbar-text)] h-16 flex items-center justify-between px-8">
      <ul className="flex space-x-8">
        <li>
          <Link href="/" className="navbarLinks">Home</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;