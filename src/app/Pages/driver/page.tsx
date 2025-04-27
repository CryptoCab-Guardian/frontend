
// "use client";
// import { useEffect, useState } from "react";
// import Navbar from "@/app/Navbar";
// import { useAuth } from "@/app/hooks/useAuth";
// import BookVehicle from "@/app/components/book_vehicle/BookVehicle";
// import { TabSelector } from "./TabSelector";
// import { WalletDisplay } from "./WalletDisplayComponent";
// import { RideDetails } from "./RideDetails";
// import { MapPlaceholder } from "./MapPlaceHolder";
// import { mockOrders } from "./DataModel";
// import { Order, TabType } from "./types";

// export default function Drive() {
//   const [activeTab, setActiveTab] = useState<TabType>("Upcoming");
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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

//   const handleAccept = (id: string) => {
//     console.log(`Accepted order ID: ${id}`);
//   };

//   const handleReject = (id: string) => {
//     console.log(`Rejected order ID: ${id}`);
//   };

//   const orders = mockOrders[activeTab];

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gray-100 p-3">
//         <div className="flex justify-between max-w-7xl mx-auto">
//           <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
//           <WalletDisplay balance={balance} />
//         </div>

//         <div className="flex flex-col-reverse md:flex-row items-start mx-auto max-w-7xl mb-12 space-y-4 md:space-y-0 md:space-x-4">
//           <div className="flex flex-col items-start space-y-4 w-full md:w-1/2 mt-5 md:mt-0">
//             {selectedOrder ? (
//               <RideDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
//             ) : (
//               <>
//                 <h2 className="text-2xl font-semibold mb-4">Choose a ride</h2>
//                 <div className="space-y-4">
//                   {orders?.map((order) => (
//                     <BookVehicle
//                       key={order.id}
//                       order={order}
//                       onAccept={handleAccept}
//                       onReject={handleReject}
//                       onSelect={() => setSelectedOrder(order)}
//                       showActions={activeTab === "Upcoming"}
//                     />
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//           <MapPlaceholder />
//         </div>
//       </div>
//     </>
//   );
// }

//---------------------------------------------------with socket commented code-------------------------------

// "use client";
// import { useEffect, useState, useCallback } from "react";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Navbar from "@/app/Navbar";
// import { useAuth } from "@/app/hooks/useAuth";
// import BookVehicle from "@/app/components/book_vehicle/BookVehicle";
// import { TabSelector } from "./TabSelector";
// import { WalletDisplay } from "./WalletDisplayComponent";
// import { RideDetails } from "./RideDetails";
// import { MapPlaceholder } from "./MapPlaceHolder";
// import { mockOrders } from "./DataModel";
// import { Order, TabType } from "./types";

// // WebSocket URL - replace with your actual WebSocket server URL
// const WEBSOCKET_URL = 'wss://demo.example.com/driver-rides';

// export default function Drive() {
//   const [activeTab, setActiveTab] = useState<TabType>("Accepted");
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [upcomingRides, setUpcomingRides] = useState<Order[]>([]);
//   const { currentAccount, balance, initializeWeb3 } = useAuth();

//   // Notification handler
//   const showNotification = (ride: Order) => {
//     // Show toast notification
//     toast.info(
//       <div>
//         <h4 className="font-bold">New Ride Request! 🚗</h4>
//         <p className="text-sm mt-1">From: {ride.pickupAddress}</p>
//         <p className="text-sm">To: {ride.dropAddress}</p>
//       </div>,
//       {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//       }
//     );

//     // Play notification sound
//     const audio = new Audio('/notification.mp3');
//     audio.play().catch(console.error);
//   };

//   // WebSocket connection handler
//   const setupWebSocket = useCallback(() => {
//     const ws = new WebSocket(WEBSOCKET_URL);

//     ws.onopen = () => {
//       console.log('WebSocket Connected');
//       // Send driver's authentication/identification
//       if (currentAccount) {
//         ws.send(JSON.stringify({
//           type: 'DRIVER_CONNECT',
//           driverId: currentAccount
//         }));
//       }
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         console.log('Received message:', data);

//         switch (data.type) {
//           case 'NEW_RIDE_REQUEST':
//             // Add new ride to upcoming rides
//             setUpcomingRides(prev => [...prev, data.ride]);
//             // Show toast notification
//             showNotification(data.ride);
            
//             // Optional: Show notification
//             if (Notification.permission === 'granted') {
//               new Notification('New Ride Request!', {
//                 body: `From: ${data.ride.pickupAddress}\nTo: ${data.ride.dropAddress}`,
//               });
//             }
//             break;

//           case 'RIDE_CANCELLED':
//             // Remove cancelled ride
//             setUpcomingRides(prev => 
//               prev.filter(ride => ride.id !== data.rideId)
//             );
//             break;

//           default:
//             console.log('Unhandled message type:', data.type);
//         }
//       } catch (error) {
//         console.error('Error processing message:', error);
//       }
//     };

//     ws.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     ws.onclose = () => {
//       console.log('WebSocket disconnected');
//       // Attempt to reconnect after 5 seconds
//       setTimeout(setupWebSocket, 5000);
//     };

//     return ws;
//   }, [currentAccount]);

//   // Initialize WebSocket connection
//   useEffect(() => {
//     const ws = setupWebSocket();

//     // Request notification permission
//     if (Notification.permission === 'default') {
//       Notification.requestPermission();
//     }

//     return () => {
//       ws.close();
//     };
//   }, [setupWebSocket]);

//   // Initialize Web3
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
//     const ws = setupWebSocket();
//     ws.send(JSON.stringify({
//       type: 'ACCEPT_RIDE',
//       rideId: id,
//       driverId: currentAccount
//     }));
    
//     // Remove from upcoming rides
//     setUpcomingRides(prev => prev.filter(ride => ride.id !== id));
//     console.log(`Accepted order ID: ${id}`);
//   };

//   const handleReject = (id: string) => {
//     const ws = setupWebSocket();
//     ws.send(JSON.stringify({
//       type: 'REJECT_RIDE',
//       rideId: id,
//       driverId: currentAccount
//     }));
    
//     // Remove from upcoming rides
//     setUpcomingRides(prev => prev.filter(ride => ride.id !== id));
//     console.log(`Rejected order ID: ${id}`);
//   };

//   // Use upcomingRides instead of mockOrders for the "Upcoming" tab
//   const orders = activeTab === "Upcoming" ? upcomingRides : mockOrders[activeTab];

//   return (
//     <>
//       <Navbar />
//       <ToastContainer 
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//       <div className="min-h-screen bg-gray-100 p-3">
//         <div className="flex justify-between max-w-7xl mx-auto">
//           <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
//           <WalletDisplay balance={balance} />
//         </div>

//         <div className="flex flex-col-reverse md:flex-row items-start mx-auto max-w-7xl mb-12 space-y-4 md:space-y-0 md:space-x-4">
//           <div className="flex flex-col items-start space-y-4 w-full md:w-1/2 mt-5 md:mt-0">
//             {selectedOrder ? (
//               <RideDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
//             ) : (
//               <>
//                 <h2 className="text-2xl font-semibold mb-4">
//                   {activeTab === "Upcoming" ? "Live Ride Requests" : "Choose a ride"}
//                 </h2>
//                 <div className="space-y-4">
//                   {orders?.map((order) => (
//                     <BookVehicle
//                       key={order.id}
//                       order={order}
//                       onAccept={handleAccept}
//                       onReject={handleReject}
//                       onSelect={() => setSelectedOrder(order)}
//                       showActions={activeTab === "Upcoming"}
//                     />
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//           <MapPlaceholder />
//         </div>
//       </div>
//     </>
//   );
// }



"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "@/app/Navbar";
import { useAuth } from "@/app/hooks/useAuth";
import { TabSelector } from "./TabSelector";
import { WalletDisplay } from "./WalletDisplayComponent";
import { RideDetails } from "./RideDetails";
import { RideList } from "./RideList";
import { MapPlaceholder } from "./MapPlaceHolder";
import { WebSocketService } from "./WebSocketConnection";
import { NotificationService } from "./NotificationService";
import { mockOrders } from "./DataModel";
import { Order, TabType, WebSocketMessage } from "./types";

export default function Drive() {
  const [activeTab, setActiveTab] = useState<TabType>("Accepted");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [upcomingRides, setUpcomingRides] = useState<Order[]>([]);
  const { currentAccount, balance } = useAuth();
  const [wsService, setWsService] = useState<WebSocketService | null>(null);

  useEffect(() => {
    const handleMessage = (data: WebSocketMessage) => {
      switch (data.type) {
        case 'NEW_RIDE_REQUEST':
          if (data.ride) {
            setUpcomingRides(prev => data.ride ? [...prev, data.ride] : prev);
            NotificationService.showToast(data.ride);
            NotificationService.showSystemNotification(data.ride);
          }
          break;
        case 'RIDE_CANCELLED':
          if (data.rideId) {
            setUpcomingRides(prev => 
              prev.filter(ride => ride.id !== data.rideId)
            );
          }
          break;
      }
    };

    const service = new WebSocketService(
      handleMessage,
      (error) => console.error('WebSocket error:', error),
      currentAccount ?? undefined
    );
    
    service.connect();
    setWsService(service);

    return () => {
      service.disconnect();
    };
  }, [currentAccount]);


const handleAccept = (id: string) => {
  if (wsService) {
    wsService.send({
      type: 'ACCEPT_RIDE',
      rideId: id,
      driverId: currentAccount ?? undefined
    });
    
    setUpcomingRides(prev => prev.filter(ride => ride.id !== id));
    toast.success('Ride accepted successfully!');
  }
};

const handleReject = (id: string) => {
  if (wsService) {
    wsService.send({
      type: 'REJECT_RIDE',
      rideId: id,
      driverId: currentAccount ??undefined
    });
    
    setUpcomingRides(prev => prev.filter(ride => ride.id !== id));
    toast.info('Ride rejected');
  }
};



  const orders = activeTab === "Upcoming" ? upcomingRides : mockOrders[activeTab];

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
        theme="light"
      />
      <div className="min-h-screen bg-gray-100 p-3">
        <div className="flex justify-between max-w-7xl mx-auto">
          <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
          <WalletDisplay balance={balance} />
        </div>

        <div className="flex flex-col-reverse md:flex-row items-start mx-auto max-w-7xl mb-12 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-col items-start space-y-4 w-full md:w-1/2 mt-5 md:mt-0">
            {selectedOrder ? (
              <RideDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
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