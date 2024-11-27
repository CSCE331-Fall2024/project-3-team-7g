import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-[var(--navbar-bg)] text-[var(--navbar-text)] h-16 flex items-center justify-between px-8">
      <ul className="flex space-x-8">
        <li>
          <Link href="/employeeHome" className="navbarLinks">Home</Link>
        </li>
      </ul>
      <ul className="flex space-x-8">
        <li>
          <Link href="/ManagerScreen" className="navbarLinks">Personnel</Link>
        </li>
        <li>
          <Link href="/ManagerScreen/menu" className="navbarLinks">Menu</Link>
        </li>
        <li>
          <Link href="/ManagerScreen/prices" className="navbarLinks">Prices</Link>
        </li>
        <li>
          <Link href="/ManagerScreen/inventory" className="navbarLinks">Inventory</Link>
        </li>
        <li>
          <Link href="/ManagerScreen/productUsage" className="navbarLinks">Product Usage</Link>
        </li>
        <li>
          <Link href="/ManagerScreen/reports" className="navbarLinks">Reports</Link>
        </li>
        <li>
          <Link href="/ManagerScreen/XZreports" className="navbarLinks">X and Z Reports</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;