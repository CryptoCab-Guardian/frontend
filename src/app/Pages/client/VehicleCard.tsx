// import React, { useState } from 'react';
// import Image from 'next/image';
// import { toast, ToastContainer } from 'react-toastify';
// import { useAuth } from "@/app/hooks/useAuth";

// // Type for our vehicle object
// interface Vehicle {
//   id: string;
//   category: string;
//   price: string;
//   pickupAddress: string;
//   dropAddress: string;
//   description: string;
//   capacity: number;
//   image: string;
// }

// interface VehicleCardProps {
//   vehicle: Vehicle;
//   selectedPrice?: string;
//   pickupLocation?: { lat: string; lng: string };
//   dropoffLocation?: { lat: string; lng: string };
// }

// const VehicleCard: React.FC<VehicleCardProps> = ({
//   vehicle,
//   selectedPrice,
//   pickupLocation,
//   dropoffLocation
// }) => {
//   const { currentAccount } = useAuth();
//   const [isPolling, setIsPolling] = useState(false);
//   const [rideId, setRideId] = useState<string | null>(null);

//   // Function to poll the status endpoint
//   const pollRideStatus = (toastId: React.ReactText ,rideId:string) => {
//     setIsPolling(true);

//     const checkStatus = async () => {
//       try {
//         const response = await fetch(`http://localhost:7777/status/${rideId}`);

//         if (!response.ok) {
//           console.error("Error checking ride status:", response.status);
//           return false;
//         }

//         const data = await response.json();
//         console.log("Ride status response:", data);

//         // Check if the status is ASSIGNED
//         if (data.ride.status === "ASSIGNED") {
//           // Update toast with success message
//           toast.update(toastId, {
//             render: "Driver assigned! Your ride is on the way.",
//             type: "success",
//             isLoading: false,
//             autoClose: 5000
//           });

//           // Store ride ID if available
//           if (data.rideId) {
//             setRideId(data.rideId);
//           }

//           // Stop polling
//           setIsPolling(false);
//           return true;
//         }

//         return false;
//       } catch (error) {
//         console.error("Error polling ride status:", error);
//         return false;
//       }
//     };

//     // Poll every 3 seconds with a timeout of 2 minutes (40 attempts)
//     let attempts = 0;
//     const maxAttempts = 30;

//     const interval = setInterval(async () => {
//       attempts++;

//       const success = await checkStatus();

//       // Stop polling if successful or max attempts reached
//       if (success || attempts >= maxAttempts) {
//         clearInterval(interval);
//         setIsPolling(false);

//         // If we hit the max attempts without success
//         if (!success && attempts >= maxAttempts) {
//           toast.update(toastId, {
//             render: "Ride booked! Still waiting for driver assignment.",
//             type: "info",
//             isLoading: false,
//             autoClose: 5000
//           });
//         }
//       }
//     }, 3000);

//     // Return cleanup function
//     return () => clearInterval(interval);
//   };

//   const handleBookRide = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     console.log("Book ride button clicked!", {
//       vehicle,
//       pickupLocation,
//       dropoffLocation,
//       currentAccount
//     });

//     if (!pickupLocation || !dropoffLocation) {
//       toast.error("Location coordinates are missing. Please try searching again.");
//       return;
//     }

//     if (!currentAccount) {
//       toast.error("Please login to book a ride");
//       return;
//     }

//     try {
//       // Show loading toast
//       const bookingToast = toast.loading("Booking your ride...");

//       const requestBody = {
//         src: pickupLocation,
//         dest: dropoffLocation
//         // vehicleType: vehicle.category (uncomment if needed)
//       };

//       console.log("Request body:", requestBody);

//       const response = await fetch(`http://localhost:7777/bookRide/${currentAccount}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody)
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Error response:", errorText);
//         throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log("API response data:", data);
//       setRideId(data.rideData.rideId);

//       // Update toast to indicate waiting for driver
//       toast.update(bookingToast, {
//         render: "Ride booked! Looking for a driver...",
//         type: "info",
//         isLoading: true
//       });

//       // Start polling for ride status
//       pollRideStatus(bookingToast,data.rideData.rideId);

//     } catch (error) {
//       console.error("Error booking ride:", error);
//       toast.error(`Failed to book ride: ${error instanceof Error ? error.message : "Unknown error"}`);
//     }
//   };

//   return (
//     <div
//       className="flex items-start space-x-4 bg-white p-4 rounded-xl shadow-md hover:bg-gray-50 hover:shadow-lg transition-all cursor-pointer relative"
//     >
//       <ToastContainer/>
//       <div className="flex-shrink-0 w-20 h-20 relative">
//         <Image
//           src={vehicle.image}
//           alt={vehicle.category}
//           fill
//           style={{ objectFit: 'cover' }}
//           className="rounded-md"
//         />
//       </div>
//       <div className="flex-1">
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg font-semibold">{vehicle.category}</h3>
//           <div className="text-lg font-bold text-green-600">
//             {selectedPrice || vehicle.price}
//           </div>
//         </div>
//         <p className="text-gray-600 text-sm mb-1">{vehicle.description}</p>
//         <div className="flex items-center text-sm text-gray-500">
//           <span className="mr-2">Capacity: {vehicle.capacity}</span>
//         </div>
//       </div>

//       {/* Positioned button in bottom right */}
//       <button
//         className="absolute bottom-3 right-3 px-4 py-1 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
//         onClick={handleBookRide}
//         disabled={isPolling}
//       >
//         {isPolling ? "Finding Driver..." : "Book Now"}
//       </button>
//     </div>
//   );
// };

// export default VehicleCard;





// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { toast, ToastContainer } from "react-toastify";
// import { useAuth } from "@/app/hooks/useAuth";
// import { useRouter } from "next/navigation";

// // Type for our vehicle object
// interface Vehicle {
//   id: string;
//   category: string;
//   price: string;
//   pickupAddress: string;
//   dropAddress: string;
//   description: string;
//   capacity: number;
//   image: string;
// }

// interface VehicleCardProps {
//   vehicle: Vehicle;
//   selectedPrice?: string;
//   pickupLocation?: { lat: string; lng: string };
//   dropoffLocation?: { lat: string; lng: string };
// }

// const VehicleCard: React.FC<VehicleCardProps> = ({
//   vehicle,
//   selectedPrice,
//   pickupLocation,
//   dropoffLocation,
// }) => {
//   const { currentAccount } = useAuth();
//   const router = useRouter();
//   const [isPolling, setIsPolling] = useState(false);
//   const [rideId, setRideId] = useState<string | null>(null);
//   const [driverId, setDriverId] = useState<string | null>(null);
//   const [showDriverNotification, setShowDriverNotification] = useState(false);

//   // Check if we already have an active ride on component mount
//   useEffect(() => {
//     const storedRideId = localStorage.getItem("activeRideId");
//     const storedDriverId = localStorage.getItem("activeDriverId");

//     if (storedRideId && storedDriverId) {
//       setRideId(storedRideId);
//       setDriverId(storedDriverId);
//       setShowDriverNotification(true);
//     }
//   }, []);

//   // Function to poll the status endpoint
//   const pollRideStatus = (toastId: React.ReactText, rideId: string) => {
//     setIsPolling(true);

//     const checkStatus = async () => {
//       try {
//         const response = await fetch(`http://localhost:7777/status/${rideId}`);

//         if (!response.ok) {
//           console.error("Error checking ride status:", response.status);
//           return false;
//         }

//         const data = await response.json();
//         console.log("Ride status response:", data);

//         // Check if the status is ASSIGNED
//         if (data.ride.status === "ASSIGNED") {
//           // Store ride and driver info
//           setDriverId(data.ride.driverId);

//           // Save to localStorage for persistence
//           localStorage.setItem("activeRideId", rideId);
//           localStorage.setItem("activeDriverId", data.ride.driverId);

//           // Show the floating driver notification
//           setShowDriverNotification(true);

//           // Update toast with success message
//           toast.update(toastId, {
//             render: "Driver assigned! Your ride is on the way.",
//             type: "success",
//             isLoading: false,
//             autoClose: 5000,
//           });

//           // Stop polling
//           setIsPolling(false);
//           return true;
//         }

//         return false;
//       } catch (error) {
//         console.error("Error polling ride status:", error);
//         return false;
//       }
//     };

//     // Poll every 3 seconds with a timeout of 2 minutes (40 attempts)
//     let attempts = 0;
//     const maxAttempts = 30;

//     const interval = setInterval(async () => {
//       attempts++;

//       const success = await checkStatus();

//       // Stop polling if successful or max attempts reached
//       if (success || attempts >= maxAttempts) {
//         clearInterval(interval);
//         setIsPolling(false);

//         // If we hit the max attempts without success
//         if (!success && attempts >= maxAttempts) {
//           toast.update(toastId, {
//             render: "Ride booked! Still waiting for driver assignment.",
//             type: "info",
//             isLoading: false,
//             autoClose: 5000,
//           });
//         }
//       }
//     }, 3000);

//     // Return cleanup function
//     return () => clearInterval(interval);
//   };

//   const handleBookRide = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     console.log("Book ride button clicked!", {
//       vehicle,
//       pickupLocation,
//       dropoffLocation,
//       currentAccount,
//     });

//     if (!pickupLocation || !dropoffLocation) {
//       toast.error(
//         "Location coordinates are missing. Please try searching again."
//       );
//       return;
//     }

//     if (!currentAccount) {
//       toast.error("Please login to book a ride");
//       return;
//     }

//     try {
//       // Show loading toast
//       const bookingToast = toast.loading("Booking your ride...");

//       const requestBody = {
//         src: pickupLocation,
//         dest: dropoffLocation,
//         // vehicleType: vehicle.category (uncomment if needed)
//       };

//       console.log("Request body:", requestBody);

//       const response = await fetch(
//         `http://localhost:7777/bookRide/${currentAccount}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Error response:", errorText);
//         throw new Error(
//           `HTTP error! Status: ${response.status}, Details: ${errorText}`
//         );
//       }

//       const data = await response.json();
//       console.log("API response data:", data);
//       setRideId(data.rideData.rideId);

//       // Update toast to indicate waiting for driver
//       toast.update(bookingToast, {
//         render: "Ride booked! Looking for a driver...",
//         type: "info",
//         isLoading: true,
//       });

//       // Start polling for ride status
//       pollRideStatus(bookingToast, data.rideData.rideId);
//     } catch (error) {
//       console.error("Error booking ride:", error);
//       toast.error(
//         `Failed to book ride: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`
//       );
//     }
//   };

//   const handleViewRideDetails = () => {
//     if (rideId) {
//       router.push(`/page/${rideId}`);
//     }
//   };

//   return (
//     <>
//       <div className="flex items-start space-x-4 bg-white p-4 rounded-xl shadow-md hover:bg-gray-50 hover:shadow-lg transition-all cursor-pointer relative">
//         <ToastContainer/>
//         <div className="flex-shrink-0 w-20 h-20 relative">
//           <Image
//             src={vehicle.image}
//             alt={vehicle.category}
//             fill
//             style={{ objectFit: "cover" }}
//             className="rounded-md"
//           />
//         </div>
//         <div className="flex-1">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold">{vehicle.category}</h3>
//             <div className="text-lg font-bold text-green-600">
//               {selectedPrice || vehicle.price}
//             </div>
//           </div>
//           <p className="text-gray-600 text-sm mb-1">{vehicle.description}</p>
//           <div className="flex items-center text-sm text-gray-500">
//             <span className="mr-2">Capacity: {vehicle.capacity}</span>
//           </div>
//         </div>

//         {/* Positioned button in bottom right */}
//         <button
//           className="absolute bottom-3 right-3 px-4 py-1 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
//           onClick={handleBookRide}
//           disabled={isPolling || showDriverNotification}
//         >
//           {isPolling
//             ? "Finding Driver..."
//             : showDriverNotification
//             ? "Ride Booked"
//             : "Book Now"}
//         </button>
//       </div>

//       {/* Floating driver assigned notification */}
//       {showDriverNotification && (
//         <div
//           onClick={handleViewRideDetails}
//           className="fixed top-14 right-1 bg-black text-white px-5 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-3 cursor-pointer hover:bg-gray-800 transition-colors"
//         >
//           <div className="rounded-full bg-green-500 h-8 w-8 flex items-center justify-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
//             </svg>
//           </div>
//           <div>
//             <p className="font-semibold">Driver is on the way!</p>
//             <p className="text-sm opacity-80">
//               About 5 minutes away. Tap for details
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Remove ToastContainer from here and place it in your main layout */}
//     </>
//   );
// };

// export default VehicleCard;





import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "@/app/hooks/useAuth";

// Type for our vehicle object
interface Vehicle {
  id: string;
  category: string;
  price: string;
  pickupAddress: string;
  dropAddress: string;
  description: string;
  capacity: number;
  image: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  selectedPrice?: string;
  pickupLocation?: { lat: string; lng: string };
  dropoffLocation?: { lat: string; lng: string };
  onRideBooked?: (rideId: string, driverId: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  selectedPrice,
  pickupLocation,
  dropoffLocation,
  onRideBooked,
}) => {
  const { currentAccount } = useAuth();
  const [isPolling, setIsPolling] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [hasActiveRide, setHasActiveRide] = useState(false);
  
  // Check if there's an active ride in localStorage on component mount
  useEffect(() => {
    const checkForActiveRide = () => {
      const storedRideId = localStorage.getItem("activeRideId");
      const storedDriverId = localStorage.getItem("activeDriverId");
      
      if (storedRideId && storedDriverId) {
        setHasActiveRide(true);
      }
    };
    
    // Check immediately on mount
    checkForActiveRide();
    
    // Also set up a listener for storage changes (in case another component updates localStorage)
    window.addEventListener('storage', checkForActiveRide);
    
    return () => {
      window.removeEventListener('storage', checkForActiveRide);
    };
  }, []);
  
  // Function to poll the status endpoint
  const pollRideStatus = (toastId: React.ReactText, rideId: string) => {
    setIsPolling(true);

    const checkStatus = async () => {
      try {
        const response = await fetch(`http://localhost:7777/status/${rideId}`);

        if (!response.ok) {
          console.error("Error checking ride status:", response.status);
          return false;
        }

        const data = await response.json();
        console.log("Ride status response:", data);

        // Check if the status is ASSIGNED
        if (data.ride.status === "ASSIGNED") {
          const driverId = data.ride.driverId;
          
          // Save to localStorage for persistence
          localStorage.setItem("activeRideId", rideId);
          localStorage.setItem("activeDriverId", driverId);
          
          // Update toast with success message
          toast.update(toastId, {
            render: "Driver assigned! Your ride is on the way.",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          });
          
          // Notify parent component about the booking
          if (onRideBooked) {
            onRideBooked(rideId, driverId);
          }
          
          // Update local state
          setIsBooked(true);
          setHasActiveRide(true);
          setIsPolling(false);
          return true;
        }

        return false;
      } catch (error) {
        console.error("Error polling ride status:", error);
        return false;
      }
    };

    let attempts = 0;
    const maxAttempts = 30;

    const interval = setInterval(async () => {
      attempts++;

      const success = await checkStatus();

      if (success || attempts >= maxAttempts) {
        clearInterval(interval);
        setIsPolling(false);

        if (!success && attempts >= maxAttempts) {
          toast.update(toastId, {
            render: "Ride booked! Still waiting for driver assignment.",
            type: "info",
            isLoading: false,
            autoClose: 5000,
          });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  };

  const handleBookRide = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!pickupLocation || !dropoffLocation) {
      toast.error(
        "Location coordinates are missing. Please try searching again."
      );
      return;
    }

    if (!currentAccount) {
      toast.error("Please login to book a ride");
      return;
    }
    
    // Don't allow booking if there's already an active ride
    if (hasActiveRide) {
      toast.error("You already have an active ride. Please complete or cancel it before booking a new one.");
      return;
    }

    try {
      const bookingToast = toast.loading("Booking your ride...");

      const requestBody = {
        src: pickupLocation,
        dest: dropoffLocation,
        price:selectedPrice,
        vehicleType: vehicle.category
      };

      console.log("Request body:", requestBody);

      const response = await fetch(
        `http://localhost:7777/bookRide/${currentAccount}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `HTTP error! Status: ${response.status}, Details: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("API response data:", data);
      const newRideId = data.rideData.rideId;

      toast.update(bookingToast, {
        render: "Ride booked! Looking for a driver...",
        type: "info",
        isLoading: true,
      });

      pollRideStatus(bookingToast, newRideId);
    } catch (error) {
      console.error("Error booking ride:", error);
      toast.error(
        `Failed to book ride: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // Determine the button state text
  const getButtonText = () => {
    if (isPolling) return "Finding Driver...";
    if (isBooked) return "Ride Booked";
    if (hasActiveRide) return "Active Ride Exists";
    return "Book Now";
  };

  return (
    <div className="flex items-start space-x-4 bg-white p-4 rounded-xl shadow-md hover:bg-gray-50 hover:shadow-lg transition-all cursor-pointer relative">
      <ToastContainer/>
      <div className="flex-shrink-0 w-20 h-20 relative">
        <Image
          src={vehicle.image}
          alt={vehicle.category}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-md"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{vehicle.category}</h3>
          <div className="text-lg font-bold text-green-600">
            {selectedPrice || vehicle.price}
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-1">{vehicle.description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-2">Capacity: {vehicle.capacity}</span>
        </div>
      </div>

      <button
        className="absolute bottom-3 right-3 px-4 py-1 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        onClick={handleBookRide}
        disabled={isPolling || isBooked || hasActiveRide}
      >
        {getButtonText()}
      </button>
    </div>
  );
};

export default VehicleCard;