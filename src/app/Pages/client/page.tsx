
"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/Navbar";
import { useAuth } from "@/app/hooks/useAuth";
import { mockCars } from "./DataModel";
import WalletDisplay from "./WalletDisplay";
import RideSearchForm from "./RideSearchForm";
import VehicleList from "./VehicleList";
import MapPlaceholder from "./MapPlaceHolder";
import { useRouter } from "next/navigation";

const Rider = () => {
  const [showVehicles, setShowVehicles] = useState(false);
  const [filteredCars, setFilteredCars] = useState(mockCars);
  const { currentAccount, balance, initializeWeb3 } = useAuth();
  const router = useRouter();

  // Location state variables
  const [pickupLocation, setPickupLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  }>();
  const [dropoffLocation, setDropoffLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  }>();
  const [distance, setDistance] = useState<number>();
  const [price, setPrice] = useState<string>();
  const [routeGeometry, setRouteGeometry] = useState<string>("");

  // Active ride notification state
  const [activeRideId, setActiveRideId] = useState<string | null>(null);
  const [activeDriverId, setActiveDriverId] = useState<string | null>(null);
  const [showDriverNotification, setShowDriverNotification] = useState(false);

  // Initialize wallet
  useEffect(() => {
    if (currentAccount) {
      initializeWeb3(currentAccount);
      const intervalId = setInterval(() => {
        initializeWeb3(currentAccount);
      }, 30000);
      return () => clearInterval(intervalId);
    }
  }, [currentAccount, initializeWeb3]);

  


  // Check for active rides on component mount and whenever dependencies change
useEffect(() => {
  const checkForActiveRide = () => {
    const storedRideId = localStorage.getItem("activeRideId");
    const storedDriverId = localStorage.getItem("activeDriverId");

    console.log("Checking for active ride:", {
      storedRideId,
      storedDriverId,
    });

   
    if (storedRideId || storedDriverId) {
      setActiveRideId(storedRideId);
      setActiveDriverId(storedDriverId);
      setShowDriverNotification(true);
    } else {
      setShowDriverNotification(false);
    }
  };

  // Check immediately when component mounts
  checkForActiveRide();

  // Set up interval to periodically check
  const intervalId = setInterval(checkForActiveRide, 5000);

  // Also set up a listener for storage changes (in case another tab updates it)
  window.addEventListener("storage", checkForActiveRide);

  // Clean up
  return () => {
    clearInterval(intervalId);
    window.removeEventListener("storage", checkForActiveRide);
  };
}, []);




// Also watch for changes in activeRideId and activeDriverId state
useEffect(() => {

  if (activeRideId || activeDriverId) {
    setShowDriverNotification(true);
  } else {
    setShowDriverNotification(false);
  }
}, [activeRideId, activeDriverId]);





// Handle when a ride gets booked and driver is assigned
const handleRideBooked = (rideId: string, driverId: string) => {
  console.log("Ride booked with driver:", { rideId, driverId });
  
  // Store in state
  setActiveRideId(rideId);
  setActiveDriverId(driverId);
  
  // Always show notification immediately when a ride is booked
  setShowDriverNotification(true);
  
  // Also ensure values are in localStorage
  localStorage.setItem("activeRideId", rideId);
  localStorage.setItem("activeDriverId", driverId);
};

  // Navigate to ride details page
  const handleViewRideDetails = () => {
    if (activeRideId) {
      router.push(`/Pages/client/${activeRideId}`);
    }
  };

  // Calculate price based on distance
  useEffect(() => {
    if (distance) {
      const baseFare = 50; 
      const ratePerKm = 15; 
      const calculatedPrice = baseFare + distance * ratePerKm;

      // Format with Indian Rupee symbol and thousands separator
      const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0, 
      }).format(calculatedPrice);

      setPrice(formattedPrice);
    }
  }, [distance]);

  const handleSearch = async (
    from: string,
    to: string,
    vehicleType: string
  ) => {
    // Filter cars by locations and vehicle type
    console.log(to);
    console.log(from);
    console.log(vehicleType);
    const filtered = mockCars.filter((car) => {
      const fromMatch = from
        ? from.toLowerCase().includes(car.pickupAddress.toLowerCase())
        : true;
      console.log(fromMatch);

      const toMatch = to
        ? to.toLowerCase().includes(car.dropAddress.toLowerCase())
        : true;
      console.log(toMatch);
      const typeMatch = car?.category
        ?.toLowerCase()
        ?.includes(vehicleType.toLowerCase());

      console.log(typeMatch);
      return fromMatch && toMatch && typeMatch;
    });

    console.log("Filtered cars:", filtered);
    setFilteredCars(filtered);
    setShowVehicles(true);



    // Get coordinates for both locations
    try {
      // Get pickup coordinates
      const pickupResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          from
        )}&limit=1`,
        { headers: { "User-Agent": "RideBookingApp/1.0" } }
      );
      const pickupData = await pickupResponse.json();

      // Get dropoff coordinates
      const dropoffResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          to
        )}&limit=1`,
        { headers: { "User-Agent": "RideBookingApp/1.0" } }
      );
      const dropoffData = await dropoffResponse.json();

      if (pickupData.length > 0 && dropoffData.length > 0) {
        const pickup = {
          lat: parseFloat(pickupData[0].lat),
          lng: parseFloat(pickupData[0].lon),
          name: from,
        };

        const dropoff = {
          lat: parseFloat(dropoffData[0].lat),
          lng: parseFloat(dropoffData[0].lon),
          name: to,
        };

        setPickupLocation(pickup);
        setDropoffLocation(dropoff);

        // Calculate straight-line distance as fallback
        const straightLineDistance = calculateDistance(
          pickup.lat,
          pickup.lng,
          dropoff.lat,
          dropoff.lng
        );




        try {
          // Get actual route distance using OSRM API
          const routeResponse = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=polyline`
          );
          const routeData = await routeResponse.json();

          if (routeData.routes && routeData.routes.length > 0) {
            // OSRM returns distance in meters, convert to kilometers
            const routeDistanceKm = routeData.routes[0].distance / 1000;
            console.log("Route distance:", routeDistanceKm, "km");
            setDistance(routeDistanceKm);

            // Store the route geometry for the map
            setRouteGeometry(routeData.routes[0].geometry);
          } else {
            // Fallback to straight-line distance
            console.log(
              "Using straight-line distance:",
              straightLineDistance,
              "km"
            );
            setDistance(straightLineDistance);
          }
        } catch (routeError) {
          console.error("Error calculating route:", routeError);
          // Fallback to straight-line distance
          setDistance(straightLineDistance);
        }
      }
    } catch (error) {
      console.error("Error fetching location coordinates:", error);
    }
  };




  // Calculate distance between two points using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };




  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="flex justify-end max-w-7xl mx-auto">
          <WalletDisplay balance={balance} />
        </div>

        <div className="max-w-7xl mx-auto mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <RideSearchForm onSearch={handleSearch} />

              <div className="space-y-4 overflow-y-auto max-h-[17rem] pr-1 mt-5">
                <VehicleList
                  vehicles={filteredCars}
                  showList={showVehicles}
                  selectedPrice={price}
                  pickupLocation={
                    pickupLocation
                      ? {
                          ...pickupLocation,
                          lat: pickupLocation.lat.toString(),
                          lng: pickupLocation.lng.toString(),
                        }
                      : undefined
                  }
                  dropoffLocation={
                    dropoffLocation
                      ? {
                          ...dropoffLocation,
                          lat: dropoffLocation.lat.toString(),
                          lng: dropoffLocation.lng.toString(),
                        }
                      : undefined
                  }
                  onRideBooked={handleRideBooked}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <MapPlaceholder
                pickupLocation={pickupLocation}
                dropoffLocation={dropoffLocation}
                distance={distance}
                price={price}
                routeGeometry={routeGeometry}
              />
            </div>
          </div>
        </div>

        {/* Driver notification - always visible when a ride is active */}
        {showDriverNotification && (
          <div
            onClick={handleViewRideDetails}
            className="fixed top-24 left-1 bg-black text-white px-5 py-3 rounded-lg shadow-lg z-[9999] flex items-center space-x-3 cursor-pointer hover:bg-gray-800 transition-colors"
          >
            <div className="rounded-full bg-green-500 h-8 w-8 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold">Driver is on the way!</p>
              <p className="text-sm opacity-80">
                About 5 minutes away. Tap for details
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Rider;
