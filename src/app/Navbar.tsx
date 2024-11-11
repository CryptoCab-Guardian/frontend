const Navbar = () => {
    return (
      <div className="w-full p-5 flex justify-between items-center bg-black text-white">
        {/* Logo */}
        <div className="text-2xl font-bold">XYZ</div>
  
        {/* Desktop Links */}
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
  
        {/* Log in and Sign up (Visible on all screens) */}
        <div className="space-x-4 flex items-center">
          <a href="#" className="text-sm hover:underline">
            Log in
          </a>
          <button className="bg-white text-black px-4 py-2 rounded-full">
            Sign up
          </button>
        </div>
      </div>
    );
  };
  
  export default Navbar;
  