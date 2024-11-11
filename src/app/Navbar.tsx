import Link from "next/link";

const Navbar = () => {
    return (
      <div className="w-full p-5 flex justify-between items-center bg-black text-white">
        {/* Logo */}
        <div className="text-2xl font-bold">XYZ</div>
  
        
        <div className="hidden md:flex space-x-4">
          <a href="#" className="hover:underline">
            Ride
          </a>
          <a href="#" className="hover:underline">
            Drive
          </a>
          <a href="#" className="hover:underline">
            Business
          </a>
          <a href="#" className="hover:underline">
            About
          </a>
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
  