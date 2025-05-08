
"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/Navbar";
import { useAuth } from "@/app/hooks/useAuth";
import { mockCars } from "./DataModel";
import WalletDisplay from "./WalletDisplay";
import RideSearchForm from "./RideSearchForm";
import VehicleList from "./VehicleList";
import MapPlaceholder from "./MapPlaceHolder";

const Rider = () => {
  const [showVehicles, setShowVehicles] = useState(false);
  const [filteredCars, setFilteredCars] = useState(mockCars);
  const { currentAccount, balance, initializeWeb3 } = useAuth();

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

  // Calculate price based on distance
  useEffect(() => {
    if (distance) {
      // Simple pricing model: Base fare + rate per km
      const baseFare = 5; // $5 base fare
      const ratePerKm = 1.5; // $1.5 per km
      const calculatedPrice = baseFare + distance * ratePerKm;
      setPrice(`$${calculatedPrice.toFixed(2)}`);
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
                  pickupLocation={pickupLocation ? { ...pickupLocation, lat: pickupLocation.lat.toString(), lng: pickupLocation.lng.toString() } : undefined} 
                  dropoffLocation={dropoffLocation ? { ...dropoffLocation, lat: dropoffLocation.lat.toString(), lng: dropoffLocation.lng.toString() } : undefined} 
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
      </div>
    </>
  );
};

export default Rider;
