
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "@/app/hooks/useAuth";

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

export default function VehicleCard({ vehicle, selectedPrice, pickupLocation, dropoffLocation, onRideBooked }: VehicleCardProps) {
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
					return;
				}

				const data = await response.json();

				if (data.status === "ASSIGNED") {
					const driverId = data.driverId;

					localStorage.setItem("activeRideId", rideId);
					localStorage.setItem("activeDriverId", driverId);

					// {
    				// 	"status": "ASSIGNED",
    				// 	"src": "Burdwan Municipal Girls School, Kachari Road, Bamakalitala, Badamtala, Bardhaman, Burdwan - I, Purba Bardhaman, West Bengal, 713101, India",
    				// 	"dest": "BC Road, Bamakalitala, Badamtala, Bardhaman, Burdwan - I, Purba Bardhaman, West Bengal, 713101, India",
    				// 	"price": "₹69",
    				// 	"driverId": "0x0Ca70C9069ffacEf17b92eC81f413F76fB775711",
    				// 	"rideId": "faf9ed5c-d41a-450b-8a69-3fddfaf0191d",
    				// 	"driverPosition": {
        			// 		"longitude": "87.87377268075942993",
        			// 		"latitude": "23.2359219405210311"
    				// 	}
					// }	

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

				return;
			}
			catch (error) {
				console.error("Error polling ride status:", error);
				return;
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
				price: selectedPrice,
				vehicleType: vehicle.category
			};

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
			const rideId = data.rideId;
			localStorage.setItem("vehicleType",vehicle.category);
			toast.update(bookingToast, {
				render: "Ride booked! Looking for a driver...",
				type: "info",
				isLoading: true,
			});

			pollRideStatus(bookingToast, rideId);
		}
		catch (error) {
			toast.error(`Failed to book ride: ${error instanceof Error ? error.message : "Unknown error"}`);
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
			<ToastContainer />
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
