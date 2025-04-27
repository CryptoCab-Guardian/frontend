// "use client";
// import { useEffect, useState } from "react";
// import BookVehicle from "@/app/components/book_vehicle/BookVehicle";
// import Navbar from "@/app/Navbar";
// import { useAuth } from "@/app/hooks/useAuth";

// type Order = {
//   id: string;
//   category: string;
//   price: string;
//   pickupDate: string;
//   pickupAddress: string;
//   dropDate: string;
//   dropAddress: string;
// };

// const mockOrders: Record<string, Order[]> = {
//   Completed: [
//     {
//       id: "816495",
//       category: "Food",
//       price: "₹4,198.06",
//       pickupDate: "23 Apr",
//       pickupAddress: "821 Jadloc Parkway, Calumet City, IL",
//       dropDate: "25 Apr",
//       dropAddress: "982 Cemij View",
//     },
//   ],
//   Accepted: [
//     {
//       id: "764399",
//       category: "Groceries",
//       price: "₹1,250.00",
//       pickupDate: "22 Apr",
//       pickupAddress: "100 Main St, Springfield, IL",
//       dropDate: "23 Apr",
//       dropAddress: "205 Elm St, Springfield, IL",
//     },
//   ],
//   Upcoming: [
//     {
//       id: "918372",
//       category: "Furniture",
//       price: "₹8,500.00",
//       pickupDate: "29 Apr",
//       pickupAddress: "567 Oakwood Rd, Chicago, IL",
//       dropDate: "30 Apr",
//       dropAddress: "120 Maple Ave, Chicago, IL",
//     },
//     {
//       id: "918375",
//       category: "Furniture",
//       price: "₹8,800.00",
//       pickupDate: "30 Apr",
//       pickupAddress: "567 Oakwood Rd, IL",
//       dropDate: "31 Apr",
//       dropAddress: "12 Maple Ave, Chicago, IL",
//     },
//   ],
// };

// export default function Drive() {
//     type TabType = "Completed" | "Accepted" | "Upcoming";
//   const [activeTab, setActiveTab] = useState<TabType>("Upcoming");
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const { currentAccount, balance,initializeWeb3 } = useAuth();

//   useEffect(() => {
//     if (currentAccount) {
//       initializeWeb3(currentAccount);

//       const intervalId = setInterval(() => {
//         initializeWeb3(currentAccount);
//       }, 30000);

//       return () => clearInterval(intervalId);
//     }
//   }, [currentAccount, initializeWeb3]);

//   const handleAccept = (id: string) => {
//     console.log(`Accepted order ID: ${id}`);
//   };

//   const handleReject = (id: string) => {
//     console.log(`Rejected order ID: ${id}`);
//   };

//   const orders = mockOrders[activeTab];

//   return (
//     <>
//     <Navbar/>
//     <div className="min-h-screen bg-gray-100 p-3">
//       <div className="flex justify-between max-w-7xl mx-auto">
//         <div className="flex justify-center space-x-4 mt-8 mb-6">
//           {(["Upcoming", "Accepted", "Completed"] as TabType[]).map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-4 py-2 rounded-lg ${
//                 activeTab === tab ? "bg-black text-white" : "bg-gray-200 text-black"
//               } transition-colors`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//         <div className="flex flex-col items-end mt-8 mb-6">
//             <div className="text-lg font-bold">Current Amount:</div>
//             <div className="text-lg text-green-600">
//               Ξ {Number(balance).toFixed(4)}
//             </div>
//           </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-col-reverse md:flex-row items-start mx-auto max-w-7xl mb-12 space-y-4 md:space-y-0 md:space-x-4">
//         <div className="flex flex-col items-start space-y-4 w-full md:w-1/2 mt-5 md:mt-0">
//           {selectedOrder ? (
//             // Ride Details
//             <div className="space-y-4 p-4 border rounded-lg bg-white w-full ">
//               <button onClick={() => setSelectedOrder(null)} className="text-red-500 text-xl font-bold">
//                 &times;
//               </button>
//               <h2 className="text-2xl font-semibold">Ride Details</h2>
//               <p><strong>Category:</strong> {selectedOrder.category}</p>
//               <p><strong>Price:</strong> {selectedOrder.price}</p>
//               <p><strong>Pickup Date:</strong> {selectedOrder.pickupDate}</p>
//               <p><strong>Pickup Address:</strong> {selectedOrder.pickupAddress}</p>
//               <p><strong>Drop Date:</strong> {selectedOrder.dropDate}</p>
//               <p><strong>Drop Address:</strong> {selectedOrder.dropAddress}</p>
//             </div>
//           ) : (
//             // Ride Selection List
//             <>
//               <h2 className="text-2xl font-semibold mb-4">Choose a ride</h2>
//               <div className="space-y-4">
//                 {orders?.map((order) => (
//                   <BookVehicle
//                     key={order.id}
//                     order={order}
//                     onAccept={handleAccept}
//                     onReject={handleReject}
//                     onSelect={() => setSelectedOrder(order)}
//                     showActions={activeTab === "Upcoming"}
//                   />
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//         {/* Map Holder */}
//         <div className="w-full md:w-1/2 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
//           <p className="text-gray-500">Map Placeholder</p>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// }



// "use client";
// import { useEffect, useState } from "react";
// import Navbar from "@/app/Navbar";
// import { useAuth } from "@/app/hooks/useAuth";
// import { mockCars, allLocations } from "./DataModel";
// import WalletDisplay from "./WalletDisplay";
// import RideSearchForm from "./RideSearchForm";
// import VehicleList from "./VehicleList";
// import MapPlaceholder from "./MapPlaceHolder";

// const Drive = () => {
//   const [showVehicles, setShowVehicles] = useState(false);
//   const [filteredCars, setFilteredCars] = useState(mockCars);
//   const { currentAccount, balance, initializeWeb3 } = useAuth();

//   useEffect(() => {
//     if (currentAccount) {
//       initializeWeb3(currentAccount);
//       const intervalId = setInterval(() => {
//         initializeWeb3(currentAccount);
//       }, 30000);
//       return () => clearInterval(intervalId);
//     }
//   }, [currentAccount, initializeWeb3]);

//   const handleSearch = (from: string, to: string) => {
//     const filtered = mockCars.filter((car) => {
//       const fromMatch = from
//         ? car.pickupAddress.toLowerCase().includes(from.toLowerCase())
//         : true;
//       const toMatch = to
//         ? car.dropAddress.toLowerCase().includes(to.toLowerCase())
//         : true;
//       return fromMatch && toMatch;
//     });
    
//     setFilteredCars(filtered);
//     setShowVehicles(true);
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gray-100 p-4">
//         <div className="flex justify-end max-w-7xl mx-auto">
//           <WalletDisplay balance={balance} />
//         </div>

//         <div className="max-w-7xl mx-auto mb-8">
//           <div className="grid md:grid-cols-3 gap-6">
//             <div className="md:col-span-1">
//               <RideSearchForm 
//                 locations={allLocations} 
//                 onSearch={handleSearch} 
//               />

//               <div className="space-y-4 overflow-y-auto max-h-[17rem] pr-1 mt-5">
//                 <VehicleList 
//                   vehicles={filteredCars} 
//                   showList={showVehicles}
//                 />
//               </div>
//             </div>

//             <MapPlaceholder />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Drive;



// "use client";
// import { useEffect, useState } from "react";
// import Navbar from "@/app/Navbar";
// import { useAuth } from "@/app/hooks/useAuth";
// import { mockCars, allLocations } from "./DataModel";
// import WalletDisplay from "./WalletDisplay";
// import RideSearchForm from "./RideSearchForm";
// import VehicleList from "./VehicleList";
// import MapPlaceholder from "./MapPlaceHolder";

// const Drive = () => {
//   const [showVehicles, setShowVehicles] = useState(false);
//   const [filteredCars, setFilteredCars] = useState(mockCars);
//   const { currentAccount, balance, initializeWeb3 } = useAuth();
  
//   // Add location state variables
//   const [pickupLocation, setPickupLocation] = useState<{lat: number; lng: number; name: string}>();
//   const [dropoffLocation, setDropoffLocation] = useState<{lat: number; lng: number; name: string}>();
//   const [distance, setDistance] = useState<number>();

//   useEffect(() => {
//     if (currentAccount) {
//       initializeWeb3(currentAccount);
//       const intervalId = setInterval(() => {
//         initializeWeb3(currentAccount);
//       }, 30000);
//       return () => clearInterval(intervalId);
//     }
//   }, [currentAccount, initializeWeb3]);

  

//   const handleSearch = async (from: string, to: string) => {
//     // Filter cars by locations
//     const filtered = mockCars.filter((car) => {
//       const fromMatch = from
//         ? car.pickupAddress.toLowerCase().includes(from.toLowerCase())
//         : true;
//       const toMatch = to
//         ? car.dropAddress.toLowerCase().includes(to.toLowerCase())
//         : true;
//       return fromMatch && toMatch;
//     });
    
//     setFilteredCars(filtered);
//     setShowVehicles(true);

//     // Get coordinates for both locations
//     try {
//       // Get pickup coordinates
//       const pickupResponse = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(from)}&limit=1`,
//         { headers: { 'User-Agent': 'RideBookingApp/1.0' } }
//       );
//       const pickupData = await pickupResponse.json();
      
//       // Get dropoff coordinates
//       const dropoffResponse = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(to)}&limit=1`,
//         { headers: { 'User-Agent': 'RideBookingApp/1.0' } }
//       );
//       const dropoffData = await dropoffResponse.json();
      
//       if (pickupData.length > 0 && dropoffData.length > 0) {
//         const pickup = {
//           lat: parseFloat(pickupData[0].lat),
//           lng: parseFloat(pickupData[0].lon),
//           name: from
//         };
        
//         const dropoff = {
//           lat: parseFloat(dropoffData[0].lat),
//           lng: parseFloat(dropoffData[0].lon),
//           name: to
//         };
        
//         setPickupLocation(pickup);
//         setDropoffLocation(dropoff);
        
//         // Calculate straight-line distance using Haversine formula
//         const dist = calculateDistance(
//           pickup.lat, pickup.lng, 
//           dropoff.lat, dropoff.lng
//         );
        
//         setDistance(dist);
//       }
//     } catch (error) {
//       console.error("Error fetching location coordinates:", error);
//     }
//   };

//   // Calculate distance between two points using Haversine formula
//   const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
//     const R = 6371; // Radius of the earth in km
//     const dLat = deg2rad(lat2 - lat1);
//     const dLon = deg2rad(lon2 - lon1);
//     const a = 
//       Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
//       Math.sin(dLon/2) * Math.sin(dLon/2); 
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//     const distance = R * c; // Distance in km
//     return distance;
//   };

//   const deg2rad = (deg: number): number => {
//     return deg * (Math.PI/180);
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gray-100 p-4">
//         <div className="flex justify-end max-w-7xl mx-auto">
//           <WalletDisplay balance={balance} />
//         </div>

//         <div className="max-w-7xl mx-auto mb-8">
//           <div className="grid md:grid-cols-3 gap-6">
//             <div className="md:col-span-1">
//               <RideSearchForm 
//                 locations={allLocations} 
//                 onSearch={handleSearch} 
//               />

//               <div className="space-y-4 overflow-y-auto max-h-[17rem] pr-1 mt-5">
//                 <VehicleList 
//                   vehicles={filteredCars} 
//                   showList={showVehicles}
                  
//                 />
//               </div>
//             </div>

//             <div className="md:col-span-2">
//               <MapPlaceholder 
//                 pickupLocation={pickupLocation}
//                 dropoffLocation={dropoffLocation}
//                 distance={distance}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Drive;



"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/Navbar";
import { useAuth } from "@/app/hooks/useAuth";
import { mockCars, allLocations } from "./DataModel";
import WalletDisplay from "./WalletDisplay";
import RideSearchForm from "./RideSearchForm";
import VehicleList from "./VehicleList";
import MapPlaceholder from "./MapPlaceHolder";

const Drive = () => {
  const [showVehicles, setShowVehicles] = useState(false);
  const [filteredCars, setFilteredCars] = useState(mockCars);
  const { currentAccount, balance, initializeWeb3 } = useAuth();
  
  // Location state variables
  const [pickupLocation, setPickupLocation] = useState<{lat: number; lng: number; name: string}>();
  const [dropoffLocation, setDropoffLocation] = useState<{lat: number; lng: number; name: string}>();
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
      const calculatedPrice = baseFare + (distance * ratePerKm);
      setPrice(`$${calculatedPrice.toFixed(2)}`);
    }
  }, [distance]);

  const handleSearch = async (from: string, to: string) => {
    // Filter cars by locations
    const filtered = mockCars.filter((car) => {
      const fromMatch = from
        ? car.pickupAddress.toLowerCase().includes(from.toLowerCase())
        : true;
      const toMatch = to
        ? car.dropAddress.toLowerCase().includes(to.toLowerCase())
        : true;
      return fromMatch && toMatch;
    });
    
    setFilteredCars(filtered);
    setShowVehicles(true);

    // Get coordinates for both locations
    try {
      // Get pickup coordinates
      const pickupResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(from)}&limit=1`,
        { headers: { 'User-Agent': 'RideBookingApp/1.0' } }
      );
      const pickupData = await pickupResponse.json();
      
      // Get dropoff coordinates
      const dropoffResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(to)}&limit=1`,
        { headers: { 'User-Agent': 'RideBookingApp/1.0' } }
      );
      const dropoffData = await dropoffResponse.json();
      
      if (pickupData.length > 0 && dropoffData.length > 0) {
        const pickup = {
          lat: parseFloat(pickupData[0].lat),
          lng: parseFloat(pickupData[0].lon),
          name: from
        };
        
        const dropoff = {
          lat: parseFloat(dropoffData[0].lat),
          lng: parseFloat(dropoffData[0].lon),
          name: to
        };
        
        setPickupLocation(pickup);
        setDropoffLocation(dropoff);

        // Calculate straight-line distance as fallback
        const straightLineDistance = calculateDistance(
          pickup.lat, pickup.lng, 
          dropoff.lat, dropoff.lng
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
            console.log("Using straight-line distance:", straightLineDistance, "km");
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
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
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
              <RideSearchForm 
                locations={allLocations} 
                onSearch={handleSearch} 
              />

              <div className="space-y-4 overflow-y-auto max-h-[17rem] pr-1 mt-5">
                <VehicleList 
                  vehicles={filteredCars} 
                  showList={showVehicles}
                  selectedPrice={price}
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

export default Drive;