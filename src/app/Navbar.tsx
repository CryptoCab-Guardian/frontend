

// components/Navbar.tsx
"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "../app/hooks/useAuth";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { isConnected, setConnected, setUserRole, setDisconnected } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check for existing connection on mount
    const connectedAccount = localStorage.getItem("connectedAccount");
    const userRole = localStorage.getItem("userRole");

    if (connectedAccount) {
      setConnected(connectedAccount);
    }
    if (userRole) {
      setUserRole(userRole);
    }
  }, [setConnected, setUserRole]);

  const handleLogout = () => {
    setDisconnected();
    router.push("/"); // Redirect to homepage
  };

  return (
    <div className="w-full p-5 flex justify-between items-center bg-black text-white">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold">
        XYZ
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-6">
        <Link 
          href="/pages/login"
          className="hover:text-gray-300 transition-colors"
        >
          Ride
        </Link>
        <Link 
          href="/pages/login"
          className="hover:text-gray-300 transition-colors"
        >
          Drive
        </Link>
        {isConnected && (
          <Link 
            href="/pages/wallet" 
            className="hover:text-gray-300 transition-colors"
          >
            Wallet
          </Link>
        )}
      </div>

      {/* Auth Button */}
      <div className="flex items-center space-x-4">
        {!isConnected ? (
          <Link 
            href="/pages/login"
            className="px-4 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
          >
            Log in
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-gray-200 text-black hover:bg-white transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
