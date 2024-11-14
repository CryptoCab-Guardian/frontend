
// "use client"
// import Link from "next/link";
// import MetaMaskAuth from "../metamask-auth/page";
// import { useState } from "react";

// const Login = () => {
//   const [showMetaMaskAuth, setShowMetaMaskAuth] = useState(false);

//   const handleLoginClick = () => {
//     setShowMetaMaskAuth(true); // Show the MetaMask login component
//   };

//   return (
//     <div className="h-screen">
//       <div className="flex justify-around items-center bg-gray-100">
//         <div className="text-6xl font-bold mb-4 w-1/2 mx-auto ml-28">
//           Log in to access your account
//         </div>
//         <div className="flex w-1/2 ml-8">
//           <Link href="/rider" onClick={handleLoginClick}>
//             <div className="flex flex-col items-center justify-center p-4 rounded-lg transition-colors">
//               <img
//                 src="/home/female-passenger.webp"
//                 alt="Rider"
//                 className="w-full h-full mb-2"
//               />
//             </div>
//           </Link>
//           <Link href="/driver" onClick={handleLoginClick}>
//             <div className="flex flex-col items-center justify-center p-4 rounded-lg transition-colors mt-5">
//               <img
//                 src="/home/cab-driver.webp"
//                 alt="Driver"
//                 className="w-full h-full"
//               />
//             </div>
//           </Link>
//         </div>
//       </div>

//       {/* Driver and Rider Section */}
//       <div className="flex justify-around px-8 text-5xl my-10">
//         <div className="text-center cursor-pointer text-5xl" onClick={handleLoginClick}>
//           <p className="font-bold">Driver</p>
//           <div className="mt-1 font-semibold">→</div>
//           <hr className="mt-2 border-t-2 border-black w-full" />
//         </div>
//         <div className="text-center cursor-pointer" onClick={handleLoginClick}>
//           <p className="font-bold">Rider</p>
//           <div className="mt-1 font-semibold">→</div>
//           <hr className="mt-2 border-t-2 border-black w-full" />
//         </div>
//       </div>

//       {/* MetaMask Authentication Component */}
//       {showMetaMaskAuth && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <MetaMaskAuth onClose={() => setShowMetaMaskAuth(false)} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;



// "use client";
// import MetaMaskAuth from "../metamask-auth/page";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// const Login = () => {
//   const [showMetaMaskAuth, setShowMetaMaskAuth] = useState(false);
//   const [selectedRole, setSelectedRole] = useState<string | null>(null);
//   const router = useRouter();

//   const handleLoginClick = (role: string) => {
//     setSelectedRole(role); // Set the role as either 'driver' or 'rider'
//     setShowMetaMaskAuth(true); // Show the MetaMask login component
//   };

//   const handleAuthSuccess = () => {
//     if (selectedRole === "driver") {
//       router.push("/Pages/driver");
//     } else if (selectedRole === "rider") {
//       router.push("/Pages/client");
//     }
//   };

//   return (
//     <div className="h-screen">
//       <div className="flex justify-around items-center bg-gray-100">
//         <div className="text-6xl font-bold mb-4 w-1/2 mx-auto ml-28">
//           Log in to access your account
//         </div>
//         <div className="flex w-1/2 ml-8">
//           <div onClick={() => handleLoginClick("rider")}>
//             <div className="flex flex-col items-center justify-center p-4 rounded-lg transition-colors">
//               <img
//                 src="/home/female-passenger.webp"
//                 alt="Rider"
//                 className="w-full h-full mb-2"
//               />
//             </div>
//           </div>
//           <div onClick={() => handleLoginClick("driver")}>
//             <div className="flex flex-col items-center justify-center p-4 rounded-lg transition-colors mt-5">
//               <img
//                 src="/home/cab-driver.webp"
//                 alt="Driver"
//                 className="w-full h-full"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Driver and Rider Section */}
//       <div className="flex justify-around px-8 text-5xl my-10">
//         <div className="text-center cursor-pointer text-5xl" onClick={() => handleLoginClick("driver")}>
//           <p className="font-bold">Driver</p>
//           <div className="mt-1 font-semibold">→</div>
//           <hr className="mt-2 border-t-2 border-black w-full" />
//         </div>
//         <div className="text-center cursor-pointer" onClick={() => handleLoginClick("rider")}>
//           <p className="font-bold">Rider</p>
//           <div className="mt-1 font-semibold">→</div>
//           <hr className="mt-2 border-t-2 border-black w-full" />
//         </div>
//       </div>

//       {/* MetaMask Authentication Component */}
//       {showMetaMaskAuth && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <MetaMaskAuth onClose={() => setShowMetaMaskAuth(false)} onAuthSuccess={handleAuthSuccess} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;



"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MetaMaskAuth from "../metamask-auth/page";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "@/app/Navbar";

const Login = () => {
  const router = useRouter();
  const { isConnected, setUserRole, userRole } = useAuth();
  const [showMetaMaskAuth, setShowMetaMaskAuth] = useState(false);

  // Check for existing connection on mount
  useEffect(() => {
    if (isConnected && userRole) {
      handleAuthSuccess(userRole);
    }
  }, [isConnected, userRole]);

  const handleLoginClick = (role: string) => {
    setUserRole(role);
    setShowMetaMaskAuth(true);
  };

  const handleAuthSuccess = (role: string) => {
    // Add a small delay for visual feedback
    setTimeout(() => {
      if (role === "driver") {
        router.push("/Pages/driver");
      } else if (role === "rider") {
        router.push("/Pages/client");
      }
    }, 1000);
  };

  const handleClose = () => {
    setShowMetaMaskAuth(false);
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-around items-center bg-gray-100 p-8">
        <div className="text-5xl md:text-6xl font-bold w-full md:w-1/2 mx-auto md:ml-28">
          Log in to access your account
        </div>
        <div className="hidden md:flex w-1/2 ml-8 space-x-8">
          <div 
            onClick={() => handleLoginClick("rider")}
            className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-lg"
          >
            <div className="bg-white p-4 rounded-lg">
              <img
                src="/home/female-passenger.webp"
                alt="Rider"
                className="w-full h-auto"
              />
              <p className="text-center mt-2 font-semibold">Ride with us</p>
            </div>
          </div>
          <div 
            onClick={() => handleLoginClick("driver")}
            className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-lg"
          >
            <div className="bg-white p-4 rounded-lg">
              <img
                src="/home/cab-driver.webp"
                alt="Driver"
                className="w-full h-auto"
              />
              <p className="text-center mt-2 font-semibold">Drive with us</p>
            </div>
          </div>
        </div>
      </div>

      {/* Driver and Rider Section */}
       <div className="flex justify-around px-8 text-5xl my-10">
         <div className="text-center cursor-pointer text-5xl" onClick={() => handleLoginClick("driver")}>
           <p className="font-bold">Driver</p>
           <div className="mt-1 font-semibold">→</div>
           <hr className="mt-2 border-t-2 border-black w-full" />
         </div>
         <div className="text-center cursor-pointer" onClick={() => handleLoginClick("rider")}>
           <p className="font-bold">Rider</p>
           <div className="mt-1 font-semibold">→</div>
                      <hr className="mt-2 border-t-2 border-black w-full" />
         </div>
       </div>

      {/* MetaMask Authentication Modal */}
      {showMetaMaskAuth && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="transform transition-all duration-300 max-w-lg w-full mx-4">
            <MetaMaskAuth 
              onClose={handleClose}
              onAuthSuccess={() => userRole && handleAuthSuccess(userRole)}
            />
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Login;