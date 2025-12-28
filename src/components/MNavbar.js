import { IoCart, IoPerson, IoSearch, IoMenu, IoClose } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MNavbar({ user, color, search }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [personMenuOpen, setPersonMenuOpen] = useState(false);
  const personRef = useRef();
  const router = useRouter();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (personRef.current && !personRef.current.contains(e.target)) {
        setPersonMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh(); // Refresh server components
      window.location.reload(); // Force full reload to update client context
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const displayName = user?.user_metadata?.userName || user?.email || "User";

  return (
    <nav className="z-10 bg-black bg-opacity-60 fixed top-0 w-full h-[54px] flex items-center justify-between px-6 md:px-8">

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-[61px] text-white font-bold text-[15px]">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/shop">Explore</Link></li>
        <li><Link href="/about">About Us</Link></li>
      </ul>

      {/* Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Image src="/logo_white.png" alt="Lessa Logo" width={112} height={34} priority />
      </div>

      {/* Desktop Icons */}
      <div className="hidden md:flex items-center text-white gap-6 relative" ref={personRef}>
        {/* Person Icon */}
        <div onClick={() => setPersonMenuOpen(!personMenuOpen)} className="cursor-pointer text-[24px]">
          <IoPerson className="transition-all duration-300 hover:text-red-400 drop-shadow-lg" />
        </div>

        {/* Dropdown */}
        {personMenuOpen && (
          <div className="absolute right-0 top-10 bg-black bg-opacity-90 text-white flex flex-col rounded shadow-lg py-2 min-w-[150px]">
            {!user ? (
              <>
                <Link href="/login" className="px-4 py-2 hover:bg-gray-800">Login</Link>
                <Link href="/signup" className="px-4 py-2 hover:bg-gray-800">Signup</Link>
              </>
            ) : (
              <>
                <span className="px-4 py-2 border-b border-gray-700 text-sm">Hello, {displayName}</span>
                <Link href="/profile" className="px-4 py-2 hover:bg-gray-800">Edit Profile</Link>
                <button className="px-4 py-2 text-left hover:bg-gray-800 w-full" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        )}

        {/* Other icons */}
        <Link href="/"><IoSearch className="cursor-pointer text-[24px] hover:text-green-400 drop-shadow-lg" /></Link>
        <Link href="/"><IoCart className="cursor-pointer text-[24px] hover:text-blue-400 drop-shadow-lg" /></Link>
      </div>

      {/* Mobile Hamburger */}
      <button className="md:hidden text-white text-2xl z-20" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <IoClose /> : <IoMenu />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute z-10 top-[54px] left-0 w-full bg-black bg-opacity-95 flex flex-col items-center gap-6 py-6 text-white text-lg font-bold">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/shop" onClick={() => setMenuOpen(false)}>Explore</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About Us</Link>

          {/* Mobile Person Menu */}
          <div className="flex gap-8 mt-4">
            <div onClick={() => setPersonMenuOpen(!personMenuOpen)} className="cursor-pointer">
              <IoPerson className="text-[28px] hover:text-red-400" />
              {personMenuOpen && (
                <div className="absolute mt-10 bg-black bg-opacity-95 p-2 flex flex-col rounded min-w-[150px]">
                  {!user ? (
                    <>
                      <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-800">Login</Link>
                      <Link href="/signup" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-800">Signup</Link>
                    </>
                  ) : (
                    <>
                      <span className="block px-4 py-2 border-b border-gray-700 text-sm">Hello, {displayName}</span>
                      <Link href="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-800">Edit Profile</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-800">Logout</button>
                    </>
                  )}
                </div>
              )}
            </div>
            <Link href="/" onClick={() => setMenuOpen(false)}><IoSearch className="text-[28px] hover:text-green-400" /></Link>
            <Link href="/" onClick={() => setMenuOpen(false)}><IoCart className="text-[28px] hover:text-blue-400" /></Link>
          </div>
        </div>
      )}
    </nav>
  );
}