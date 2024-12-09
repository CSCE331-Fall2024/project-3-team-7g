import Link from "next/link";

function Navbar({ screen }) {

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("Classification");
        router.push("/");
    };

    return (
        <nav className="bg-[var(--navbar-bg)] text-[var(--navbar-text)] h-16 flex items-center justify-between px-8">
            <h1 className="text-3xl font-bold">{screen}</h1>
            <ul className="flex space-x-8">
                <li>
                    <Link href="/" className="navbarLinks" onClick={handleLogout}>Log Out</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
