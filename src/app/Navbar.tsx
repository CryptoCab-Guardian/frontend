import Link from "next/link";

const Navbar = () => {
    return (
      <div className="w-full p-5 flex justify-between items-center bg-black text-white">
        {/* Logo */}
        <div className="text-2xl font-bold">XYZ</div>
  
        
        <div className="hidden md:flex space-x-4">
          <Link href="/Pages/Login" className="hover:underline">
            Ride
          </Link>
          <Link href="/Pages/Login" className="hover:underline">
            Drive
          </Link>
          <Link href="/Pages/Wallet" className="hover:underline">
            Wallet
          </Link>
        </div>
  
        <div className="space-x-4 flex items-center">
          <Link href="/Pages/Login" className="text-sm hover:underline">
            Log in
          </Link>
        </div>
      </div>
    );
  };
  
  export default Navbar;
  