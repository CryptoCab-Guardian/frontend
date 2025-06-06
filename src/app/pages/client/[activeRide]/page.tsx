"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import Image from "next/image";
import {
  FaCar,
  FaMapMarkerAlt,
  FaRegClock,
  FaUser,
  FaInfoCircle,
  FaMoneyBillWave,
  FaRoute,
} from "react-icons/fa";
import Navbar from "@/app/Navbar";


const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ASSIGNED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
};

const DetailRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <div className="flex items-center py-3 border-b border-gray-100">
    <div className="rounded-full p-2 text-white flex-shrink-0 mr-3">{icon}</div>
    <div className="flex-1">
      <p className="text-xs text-gray-500">{label}</p>
      <div className="font-medium">{value}</div>
    </div>
  </div>
);

interface RideData {
  status: string;
  src: string;
  dest: string;
  price: string;
  driverId: string;
  driverPosition?: {
    latitude: string;
    longitude: string;
  }
  rideId: string;
  vehicleType?: string;
}

const RideID = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentAccount } = useAuth();

  const [rideData, setRideData] = useState<RideData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string>("Calculating...");
  const [distance, setDistance] = useState<string>("");

  
  const rideId = params?.activeRide as string;
  const searchRideId = searchParams.get("rideId");

  
  const activeRideId = rideId || searchRideId;

  useEffect(() => {
    const fetchRideDetails = async () => {
      if (!activeRideId) {
        setError("No ride ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch ride details from your API
        const response = await fetch(
          `http://localhost:7777/status/${activeRideId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch ride details: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setRideData(data);

        // Calculate estimated time if driver position is available
        if (data.driverPosition && data.src) {
          calculateTimeAndDistance(
            parseFloat(data.driverPosition.latitude),
            parseFloat(data.driverPosition.longitude)
          );
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching ride details:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setLoading(false);
      }
    };

    fetchRideDetails();

  }, [activeRideId, currentAccount]);

  // Calculate time and distance from driver to pickup
  // Updated function to calculate time and distance using client's current location
const calculateTimeAndDistance = async (
  driverLat: number,
  driverLng: number
) => {
  try {
    // Get the client's current location using browser geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const clientLat = position.coords.latitude;
        const clientLng = position.coords.longitude;
        
        // Calculate straight line distance (in km)
        const distanceInKm = calculateDistance(
          driverLat,
          driverLng,
          clientLat,
          clientLng
        );
        
        // Add 30% to account for real road routes vs straight line
        const roadDistance = distanceInKm * 1.3;
        
        // Set the distance in the UI
        setDistance(formatDistance(roadDistance));
        
        // Calculate time based on 50 km/h driving speed
        const SPEED_KM_PER_HOUR = 50;
        const timeInHours = roadDistance / SPEED_KM_PER_HOUR;
        const timeInMinutes = Math.round(timeInHours * 60);
        
        // Format the estimated time
        if (timeInMinutes < 1) {
          setEstimatedTime("Less than a minute");
        } else if (timeInMinutes === 1) {
          setEstimatedTime("1 minute");
        } else if (timeInMinutes < 60) {
          setEstimatedTime(`${timeInMinutes} minutes`);
        } else {
          const hours = Math.floor(timeInMinutes / 60);
          const minutes = timeInMinutes % 60;
          setEstimatedTime(`${hours} hr ${minutes} min`);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        // Fall back to geocoding if geolocation fails
        geocodeDestinationAndCalculate(driverLat, driverLng);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  } catch (error) {
    console.error("Error calculating estimated time:", error);
    setEstimatedTime("5-10 minutes");
    setDistance("~3 km");
  }
};

// Fallback function to use the destination address if geolocation fails
const geocodeDestinationAndCalculate = async (
  driverLat: number,
  driverLng: number
) => {
  try {
    if (!rideData?.src) {
      throw new Error("No source address available");
    }
    
    // Geocode the destination address to get coordinates
    const geocodeResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        rideData.src
      )}&limit=1`
    );

    if (!geocodeResponse.ok) {
      throw new Error("Geocoding failed");
    }

    const geocodeData = await geocodeResponse.json();
    if (!geocodeData || !geocodeData.length) {
      throw new Error("Location not found");
    }

    const destLat = parseFloat(geocodeData[0].lat);
    const destLng = parseFloat(geocodeData[0].lon);

    // Calculate straight line distance (in km)
    const distanceInKm = calculateDistance(
      driverLat,
      driverLng,
      destLat,
      destLng
    );
    
    const roadDistance = distanceInKm * 1.3;
    setDistance(formatDistance(roadDistance));

    // Calculate time based on 50 km/h driving speed
    const SPEED_KM_PER_HOUR = 50;
    const timeInHours = roadDistance / SPEED_KM_PER_HOUR;
    const timeInMinutes = Math.round(timeInHours * 60);

    if (timeInMinutes < 1) {
      setEstimatedTime("Less than a minute");
    } else if (timeInMinutes === 1) {
      setEstimatedTime("1 minute");
    } else if (timeInMinutes < 60) {
      setEstimatedTime(`${timeInMinutes} minutes`);
    } else {
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = timeInMinutes % 60;
      setEstimatedTime(`${hours} hr ${minutes} min`);
    }
  } catch (error) {
    console.error("Error in geocoding fallback:", error);
    setEstimatedTime("5-10 minutes"); 
    setDistance("~3 km");
  }
};

  
  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; 
    return distance;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Determine the vehicle type/category to show appropriate image
  const vehicleType = rideData?.vehicleType || "Sedan";
  const vehicleImage = getVehicleImage(vehicleType);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with gradient background - smaller height */}
          <div className="bg-gradient-to-r from-gray-900 to-black px-6 py-4 text-white flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Your Ride</h1>
              <p className="text-white opacity-80 text-sm">
                Driver will arrive in {estimatedTime}
              </p>
            </div>
            <StatusBadge status={rideData?.status || "ASSIGNED"} />
          </div>

          <div className="px-6 py-4">
            {/* Quick info bar with distance and ETA */}
            <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center">
                <div className="bg-green-500 rounded-full p-1.5 text-white mr-2">
                  <FaRegClock size={12} />
                </div>
                <span className="text-sm font-medium">
                  ETA: {estimatedTime}
                </span>
              </div>
              <div className="flex items-center">
                <div className="bg-purple-500 rounded-full p-1.5 text-white mr-2">
                  <FaMoneyBillWave size={12} />
                </div>
                <span className="text-sm font-medium">
                  {rideData?.price || "₹0"}
                </span>
              </div>
            </div>

            {/* Compact table-like layout */}
            <div className="divide-y divide-gray-100">
              <DetailRow
                label="RIDE ID"
                value={
                  <span className="text-sm text-gray-700">
                    {activeRideId}
                  </span>
                }
                icon={<FaInfoCircle className="text-gray-500" />}
              />

              {rideData?.driverId && (
                <DetailRow
                  label="DRIVER"
                  value={
                    <div>
                      <p className="text-sm">
                        Driver #{rideData.driverId.substring(0, 8)}
                      </p>
                      <div className="flex items-center mt-0.5">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className="w-3 h-3 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-xs text-gray-500 ml-1">
                            4.9
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                  icon={<FaUser className="text-purple-500" />}
                />
              )}

              <DetailRow
                label="VEHICLE"
                value={
                  <div className="flex items-center">
                    <Image
                      src={vehicleImage}
                      alt={vehicleType}
                      width={40}
                      height={20}
                      className="object-contain mr-2"
                    />
                    <span>{localStorage.getItem("vehicleType")}</span>
                  </div>
                }
                icon={<FaCar className="text-blue-500" />}
              />

              <DetailRow
                label="PRICE"
                value={
                  <span className="text-lg font-semibold">
                    {rideData?.price || "₹0"}
                  </span>
                }
                icon={<FaMoneyBillWave className="text-green-500" />}
              />

              <DetailRow
                label="ROUTE"
                value={
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {rideData?.src || "Current Location"}
                    </span>
                    <div className="h-4 border-l border-dashed border-gray-300 ml-2 my-1"></div>
                    <span className="text-sm">
                      {rideData?.dest || "Destination Location"}
                    </span>
                  </div>
                }
                icon={<FaMapMarkerAlt className="text-red-500" />}
              />
              
              {/* Distance and ETA detail row */}
              <DetailRow
                label="DRIVER DETAILS"
                value={
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">Distance:</span>
                      <span className="text-sm">{distance || "Calculating..."}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-sm font-medium mr-2">Arrival in:</span>
                      <span className="text-sm">{estimatedTime}</span>
                    </div>
                  </div>
                }
                icon={<FaRoute className="text-indigo-500" />}
              />
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => window.history.back()}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition text-sm"
              >
                Back
              </button>
              <button
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                onClick={() => {
                  localStorage.removeItem("activeRideId");
                  localStorage.removeItem("activeDriverId");
                  alert("Ride cancelled");
                  window.history.back();
                }}
              >
                Cancel Ride
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function to get vehicle image based on type
function getVehicleImage(vehicleType: string): string {
  const typeMap: Record<string, string> = {
    Mini: "/client/Uber.png",
    Sedan: "/client/Uber_Black.webp",
    Luxury: "/client/Uber_Black.webp",
    SUV: "/client/Uber.png",
    Van: "/client/taxi.png",
  };

  return typeMap[vehicleType] || "/client/Uber.png";
}

export default RideID;