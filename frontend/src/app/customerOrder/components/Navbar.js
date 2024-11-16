import Link from "next/link";

function Navbar({ screen }) {
    return (
        <nav className="bg-[var(--navbar-bg)] text-[var(--navbar-text)] h-16 flex items-center justify-between px-8">
            <h1 className="text-3xl font-bold">{screen}</h1>
            <ul className="flex space-x-8">
                <li>
                    <Link href="/" className="navbarLinks">Home</Link>
                </li>
                <li>
                    <Link href="/" className="navbarLinks">View Cart</Link>
                </li>
                <li>
                    <Link href="/" className="navbarLinks">Complete Order</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;