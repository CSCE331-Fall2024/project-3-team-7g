function Navbar({ screen }) {
    return (
        <nav className="bg-[var(--navbar-bg)] text-[var(--navbar-text)] h-16 flex items-center justify-between px-8">
            <h1 className="text-3xl font-bold">{screen}</h1>
        </nav>
    );
}

export default Navbar;