
"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/app/Navbar";
import { useAuth } from "@/app/hooks/useAuth";
import { TabSelector } from "./TabSelector";
import { WalletDisplay } from "./WalletDisplayComponent";
import { RideDetails } from "./RideDetails";
import { RideList } from "./RideList";
import { MapPlaceholder } from "./MapPlaceHolder";
import { WebSocketService } from "./WebSocketConnection";
import { mockOrders } from "./DataModel";
import {
  getAddressFromCoordinates,
  Order,
  TabType,
  WebSocketMessage,
} from "./types";
import { LocationService } from "./LocationTrackingService";

export default function Drive() {
  const [activeTab, setActiveTab] = useState<TabType>("Accepted");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [upcomingRides, setUpcomingRides] = useState<Order[]>([]);
  const { currentAccount, balance } = useAuth();
  const [wsService, setWsService] = useState<WebSocketService | null>(null);
  const [, setLocationService] = useState<LocationService | null>(null);

  useEffect(() => {
    const handleMessage = async (data: WebSocketMessage) => {
      switch (data.type) {
        case "NEW_RIDE_REQUEST":
          // Create an Order object from the incoming ride request data
          const pickup = data.src
            ? (await getAddressFromCoordinates(data.src.lat, data.src.lng)) ||
              `${data.src.lat}, ${data.src.lng}`
            : "Unknown Pickup Address";

          const dropAddress = data.dest
            ? (await getAddressFromCoordinates(data.dest.lat, data.dest.lng)) ||
              `${data.dest.lat}, ${data.dest.lng}`
            : "Unknown Drop Address";

          if (data.src && data.dest && data.rideId) {

            const newRide: Order = {
              id: data.rideId,
              category: "Ride Request",
              price: "0",
              pickupAddress: pickup, 
              dropAddress: dropAddress, 
            };

            setUpcomingRides((prev) => [...prev, newRide]);
          }
          break;
        case "RIDE_CANCELLED":
          if (data.rideId) {
            setUpcomingRides((prev) =>
              prev.filter((ride) => ride.id !== data.rideId)
            );
          }
          break;
      }
    };

    const service = new WebSocketService(
      handleMessage,
      (error) => console.error("WebSocket error:", error),
      currentAccount ?? undefined
    );

    service.connect();
    setWsService(service);

    // Location tracking setup
    const ls = new LocationService(currentAccount ?? undefined);
    ls.startTracking(30); // Update every 100 seconds
    setLocationService(ls);

    // Request notification permission
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      service.disconnect();
      ls.stopTracking();
    };
  }, [currentAccount]);

  // const handleAccept = (id: string) => {
  //   if (wsService) {
  //     wsService.send({
  //       type: "ACCEPT_RIDE",
  //       rideId: id,
  //       driverId: currentAccount ?? undefined,
  //     });

  //     setUpcomingRides((prev) => prev.filter((ride) => ride.id !== id));
  //     toast.success("Ride accepted successfully!");
  //   }
  // };


  const handleAccept = async (id: string) => {
    console.log("Ride accept",id);
    if (!currentAccount) {
      toast.error("You must be logged in to accept rides");
      return;
    }
    
    // Show loading toast
    const loadingToast = toast.loading("Accepting ride...");
    
    try {
      // Make a POST request to accept the ride
      const response = await fetch(`http://localhost:7777/acceptRideByDriver/${currentAccount}/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to accept ride: ${errorText}`);
      }
      
      // Remove the ride from upcoming rides list
      setUpcomingRides((prev) => prev.filter((ride) => ride.id !== id));
      
      // Update toast to success
      toast.update(loadingToast, {
        render: "Ride accepted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 5000
      });
      
      // Optionally, you might want to add this ride to an "active rides" list
      // or switch to a different tab
      
    } catch (error) {
      console.error("Error accepting ride:", error);
      
      // Update toast to show error
      toast.update(loadingToast, {
        render: `Failed to accept ride: ${error instanceof Error ? error.message : "Unknown error"}`,
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
    }
  };

  const handleReject = (id: string) => {
    if (wsService) {
      wsService.send({
        type: "REJECT_RIDE",
        rideId: id,
        driverId: currentAccount ?? undefined,
      });

      setUpcomingRides((prev) => prev.filter((ride) => ride.id !== id));
      toast.info("Ride rejected");
    }
  };

  const orders =
    activeTab === "Upcoming" ? upcomingRides : mockOrders[activeTab];

  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" // Using built-in dark theme as base
        toastStyle={{
          background: "#222222",
          color: "#ffffff",
          boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
          borderRadius: "8px",
          borderLeft: "4px solid #555",
        }}
      />
      <div className="min-h-screen bg-gray-100 p-3">
        <div className="flex justify-between max-w-7xl mx-auto">
          <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
          <WalletDisplay balance={balance} />
        </div>

        <div className="flex flex-col-reverse md:flex-row items-start mx-auto max-w-7xl mb-12 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-col items-start space-y-4 w-full md:w-1/2 mt-5 md:mt-0">
            {selectedOrder ? (
              <RideDetails
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
              />
            ) : (
              <RideList
                orders={orders}
                activeTab={activeTab}
                onAccept={handleAccept}
                onReject={handleReject}
                onSelect={setSelectedOrder}
              />
            )}
          </div>
          <MapPlaceholder />
        </div>
        
      </div>
    </>
  );
}
