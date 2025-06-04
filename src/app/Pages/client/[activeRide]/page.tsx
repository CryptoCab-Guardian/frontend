"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import Image from "next/image";
import { FaCar, FaMapMarkerAlt, FaRegClock, FaUser, FaInfoCircle } from "react-icons/fa";
import Navbar from "@/app/Navbar";

// Modular components for better organization and reuse
const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
    {status}
  </span>
);

const DetailRow = ({ label, value, icon }: { label: string; value: React.ReactNode; icon: React.ReactNode }) => (
  <div className="flex items-center py-3 border-b border-gray-100">
    <div className="rounded-full p-2 text-white flex-shrink-0 mr-3">{icon}</div>
    <div className="flex-1">
      <p className="text-xs text-gray-500">{label}</p>
      <div className="font-medium">{value}</div>
    </div>
  </div>
);

const RideID = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentAccount } = useAuth();

  const [rideData, setRideData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details'|'map'>('details');

  // Get the activeRide ID from both route params and search params
  const rideId = params?.activeRide as string;
  const searchRideId = searchParams.get("rideId");

  // Use the ID from route params first, then fall back to search params if needed
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
        setRideData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ride details:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [activeRideId, currentAccount]);

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
  const vehicleType = rideData?.ride?.vehicleType || "Sedan";
  const vehicleImage = getVehicleImage(vehicleType);

  // Helper function to get estimated arrival time (5 minutes from now)
  const getEstimatedArrival = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

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
                Arriving soon
              </p>
            </div>
            <StatusBadge status={rideData?.ride?.status || "ASSIGNED"} />
          </div>

          {/* Tabs for navigation */}
          <div className="flex border-b">
            <button 
              className={`flex-1 py-3 text-center ${activeTab === 'details' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
              onClick={() => setActiveTab('details')}
            >
              Ride Details
            </button>
          </div>

          {activeTab === 'details' ? (
            <div className="px-6 py-4">
              {/* Quick info bar */}
              <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-full p-1.5 text-white mr-2">
                    <FaRegClock size={12} />
                  </div>
                  <span className="text-sm font-medium">{getEstimatedArrival()}</span>
                </div>
                <div className="flex items-center">
                  <Image
                    src={vehicleImage}
                    alt={vehicleType}
                    width={40}
                    height={20}
                    className="object-contain mr-2"
                  />
                  <span className="text-sm font-medium">{vehicleType}</span>
                </div>
              </div>

              {/* Compact table-like layout */}
              <div className="divide-y divide-gray-100">
                <DetailRow 
                  label="RIDE ID"
                  value={<span className="text-sm text-gray-700">{activeRideId}</span>}
                  icon={<FaInfoCircle className="text-gray-500" />}
                />

                {rideData?.ride?.driverId && (
                  <DetailRow 
                    label="DRIVER"
                    value={
                      <div>
                        <p className="text-sm">Driver #{rideData.ride.driverId.substring(0, 8)}</p>
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
                            <span className="text-xs text-gray-500 ml-1">4.9</span>
                          </div>
                        </div>
                      </div>
                    }
                    icon={<FaUser className="text-purple-500" />}
                  />
                )}

                <DetailRow 
                  label="VEHICLE"
                  value={vehicleType}
                  icon={<FaCar className="text-blue-500" />}
                />

                <DetailRow 
                  label="ROUTE"
                  value={
                    <div className="flex flex-col">
                      <span className="text-sm">{rideData?.ride?.pickup || "Current Location"}</span>
                      <div className="h-4 border-l border-dashed border-gray-300 ml-2 my-1"></div>
                      <span className="text-sm">{rideData?.ride?.destination || "Destination Location"}</span>
                    </div>
                  }
                  icon={<FaMapMarkerAlt className="text-red-500" />}
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
          ) : (
            <div className="p-4 flex items-center justify-center h-64 bg-gray-50">
              <p className="text-gray-500">Map view would be displayed here</p>
            </div>
          )}
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