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
import { getAddressFromCoordinates, Order, TabType, WebSocketMessage } from "./types";
import { LocationService } from "./LocationTrackingService";
import { FaCar, FaBell } from "react-icons/fa";

export default function Drive() {
	const [activeTab, setActiveTab] = useState<TabType>("Upcoming");
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [upcomingRides, setUpcomingRides] = useState<Order[]>([]);
	const { currentAccount, balance } = useAuth();
	const [wsService, setWsService] = useState<WebSocketService | null>(null);
	const [, setLocationService] = useState<LocationService | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const handleMessage = async (data: WebSocketMessage) => {
			switch (data.type) {
				case "NEW_RIDE_REQUEST":
					console.log("New Ride Request Details:", {
						rideId: data.rideId,
						source: data.src,
						destination: data.dest,
						price: data.price,
					});

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
							price: data.price || "0",
							pickupAddress: pickup,
							dropAddress: dropAddress,
						};

						setUpcomingRides((prev) => [...prev, newRide]);

						// Show notification for new ride
						showNotification("New Ride Request", `New ride request from ${pickup}`);
					}
					break;
				case "RIDE_CANCELLED":
					if (data.rideId) {
						setUpcomingRides((prev) =>
							prev.filter((ride) => ride.id !== data.rideId)
						);
						toast.info("A ride request was cancelled by the passenger");
					}
					break;
				case "CONNECTION_ESTABLISHED":
					setIsConnected(true);
					toast.success("Connected to ride request service");
					break;
			}
		};

		const showNotification = (title: string, body: string) => {
			// Browser notification
			if (Notification.permission === "granted") {
				new Notification(title, {
					body,
					icon: "/driver/car.jpg",
				});
			}

			// Toast notification
			toast.info(
				<div>
					<div className="font-bold">{title}</div>
					<div>{body}</div>
				</div>,
				{
					icon: <FaBell className="text-blue-500" />
				}
			);
		};

		const service = new WebSocketService(
			handleMessage,
			(error) => {
				console.error("WebSocket error:", error);
				setIsConnected(false);
				toast.error("Lost connection to ride request service");
			},
			currentAccount ?? undefined
		);

		service.connect();
		setWsService(service);

		// Location tracking setup
		const ls = new LocationService(currentAccount ?? undefined);
		ls.startTracking(10); // Update every 10 seconds
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

	const handleAccept = async (id: string, src: string, dest: string, price: string) => {
		if (!currentAccount) {
			toast.error("You must be logged in to accept rides");
			return;
		}

		// Show loading toast
		const loadingToast = toast.loading("Accepting ride...");

		try {
			const response = await fetch(
				`http://localhost:7777/acceptRideByDriver/${currentAccount}/${id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						src,
						dest,
						price
					})
				}
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Failed to accept ride: ${errorText}`);
			}

			// Find the ride that was accepted
			const acceptedRide = upcomingRides.find((ride) => ride.id === id);
			// Remove the ride from upcoming rides list
			setUpcomingRides((prev) => prev.filter((ride) => ride.id !== id));

			// Add the ride to the accepted tab by updating mockOrders
			if (acceptedRide) {
				// Create a new ride object with updated category
				const updatedRide = {
					...acceptedRide,
					category: "RIDE BOOKED", // Change the category to "RIDE BOOKED"
				};

				// Add to the Accepted list
				mockOrders.Accepted = [...mockOrders.Accepted, updatedRide];
			}

			// Switch to the Accepted tab
			setActiveTab("Accepted");

			// Update toast to success
			toast.update(loadingToast, {
				render: "Ride accepted successfully!",
				type: "success",
				isLoading: false,
				autoClose: 5000,
			});
		} catch (error) {
			console.error("Error accepting ride:", error);

			// Update toast to show error
			toast.update(loadingToast, {
				render: `Failed to accept ride: ${error instanceof Error ? error.message : "Unknown error"
					}`,
				type: "error",
				isLoading: false,
				autoClose: 5000,
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

	const handleCompleteRide = async (rideId: string) => {
		// Show loading toast
		const loadingToast = toast.loading("Completing ride...");

		try {
			// Call the backend endpoint to complete the ride
			const response = await fetch(
				`http://localhost:7777/completeRide/${currentAccount}/${rideId}`,
				{
					method: "POST",
				}
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Failed to complete ride: ${errorText}`);
			}

			// Find the ride that was completed
			const completedRide = mockOrders.Accepted.find((ride) => ride.id === rideId);

			// Remove the ride from accepted rides list
			mockOrders.Accepted = mockOrders.Accepted.filter((ride) => ride.id !== rideId);

			// Add the ride to the completed tab
			if (completedRide) {
				// Create a new ride object with updated category
				const updatedRide = {
					...completedRide,
					category: "RIDE COMPLETED",
				};

				// Add to the Completed list
				mockOrders.Completed = [updatedRide, ...mockOrders.Completed];
			}

			// Close the details panel and switch to the Completed tab
			setSelectedOrder(null);
			setActiveTab("Completed");

			// Update toast to success
			toast.update(loadingToast, {
				render: "Ride completed successfully!",
				type: "success",
				isLoading: false,
				autoClose: 5000,
			});
		} catch (error) {
			console.error("Error completing ride:", error);

			// Update toast to show error
			toast.update(loadingToast, {
				render: `Failed to complete ride: ${error instanceof Error ? error.message : "Unknown error"}`,
				type: "error",
				isLoading: false,
				autoClose: 5000,
			});
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
				theme="dark"
				toastStyle={{
					background: "#222222",
					color: "#ffffff",
					boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
					borderRadius: "8px",
					borderLeft: "4px solid #555",
				}}
			/>

			{/* Status indicator */}
			<div className={`fixed top-16 left-0 right-0 z-20 text-center py-1 text-sm font-medium text-white transition-all duration-300 ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}>
				<div className="flex items-center justify-center space-x-2">
					<div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-300 animate-pulse' : 'bg-red-300'}`}></div>
					<span>{isConnected ? 'Connected to ride service' : 'Disconnected - trying to reconnect...'}</span>
				</div>
			</div>

			<div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 pt-8 pb-6 px-4">
				<div className="flex flex-col md:flex-row justify-between max-w-7xl mx-auto items-center space-y-4 md:space-y-0 mb-6">
					<div className="flex items-center space-x-2">
						<FaCar className="text-blue-600 text-2xl" />
						<h1 className="text-2xl font-bold text-gray-800">Driver Dashboard</h1>
					</div>
					<div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
						<TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
						<WalletDisplay balance={balance} />
					</div>
				</div>

				<div className="flex flex-col-reverse md:flex-row items-start mx-auto max-w-7xl space-y-reverse space-y-6 md:space-y-0 md:space-x-6">
					<div className="flex flex-col items-start w-full md:w-1/2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						{selectedOrder ? (
							<RideDetails
								order={selectedOrder}
								onClose={() => setSelectedOrder(null)}
								onComplete={handleCompleteRide}
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
					<div className="w-full md:w-1/2">
						<MapPlaceholder selectedRide={selectedOrder} />
					</div>
				</div>
			</div>
		</>
	);
}
