
import React, { useState } from 'react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
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
}

const VehicleCard: React.FC<VehicleCardProps> = ({ 
  vehicle, 
  selectedPrice,
  pickupLocation,
  dropoffLocation 
}) => {
  const { currentAccount } = useAuth();
  const [isPolling, setIsPolling] = useState(false);
  const [rideId, setRideId] = useState<string | null>(null);
  
  // Function to poll the status endpoint
  const pollRideStatus = (toastId: React.ReactText ,rideId:string) => {
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
          // Update toast with success message
          toast.update(toastId, {
            render: "Driver assigned! Your ride is on the way.",
            type: "success",
            isLoading: false,
            autoClose: 5000
          });
          
          // Store ride ID if available
          if (data.rideId) {
            setRideId(data.rideId);
          }
          
          // Stop polling
          setIsPolling(false);
          return true;
        }
        
        return false;
      } catch (error) {
        console.error("Error polling ride status:", error);
        return false;
      }
    };
    
    // Poll every 3 seconds with a timeout of 2 minutes (40 attempts)
    let attempts = 0;
    const maxAttempts = 30;
    
    const interval = setInterval(async () => {
      attempts++;
      
      const success = await checkStatus();
      
      // Stop polling if successful or max attempts reached
      if (success || attempts >= maxAttempts) {
        clearInterval(interval);
        setIsPolling(false);
        
        // If we hit the max attempts without success
        if (!success && attempts >= maxAttempts) {
          toast.update(toastId, {
            render: "Ride booked! Still waiting for driver assignment.",
            type: "info",
            isLoading: false,
            autoClose: 5000
          });
        }
      }
    }, 3000);
    
    // Return cleanup function
    return () => clearInterval(interval);
  };

  const handleBookRide = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Book ride button clicked!", {
      vehicle,
      pickupLocation,
      dropoffLocation,
      currentAccount
    });

    if (!pickupLocation || !dropoffLocation) {
      toast.error("Location coordinates are missing. Please try searching again.");
      return;
    }

    if (!currentAccount) {
      toast.error("Please login to book a ride");
      return;
    }

    try {
      // Show loading toast
      const bookingToast = toast.loading("Booking your ride...");
      
      const requestBody = {
        src: pickupLocation,
        dest: dropoffLocation
        // vehicleType: vehicle.category (uncomment if needed)
      };
      
      console.log("Request body:", requestBody);
      
      const response = await fetch(`http://localhost:7777/bookRide/${currentAccount}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }

      const data = await response.json();
      console.log("API response data:", data);
      setRideId(data.rideData.rideId);
      
      // Update toast to indicate waiting for driver
      toast.update(bookingToast, {
        render: "Ride booked! Looking for a driver...",
        type: "info",
        isLoading: true
      });
      
      // Start polling for ride status
      pollRideStatus(bookingToast,data.rideData.rideId);
      
    } catch (error) {
      console.error("Error booking ride:", error);
      toast.error(`Failed to book ride: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <div 
      className="flex items-start space-x-4 bg-white p-4 rounded-xl shadow-md hover:bg-gray-50 hover:shadow-lg transition-all cursor-pointer relative"
    >
      <ToastContainer/>
      <div className="flex-shrink-0 w-20 h-20 relative">
        <Image
          src={vehicle.image}
          alt={vehicle.category}
          fill
          style={{ objectFit: 'cover' }}
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
      
      {/* Positioned button in bottom right */}
      <button 
        className="absolute bottom-3 right-3 px-4 py-1 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
        onClick={handleBookRide}
        disabled={isPolling}
      >
        {isPolling ? "Finding Driver..." : "Book Now"}
      </button>
    </div>
  );
};

export default VehicleCard;