import { Order } from './types';
import BookVehicle from "@/app/components/book_vehicle/BookVehicle";
import { FaCarSide, FaCheckCircle, FaClock } from "react-icons/fa";
import { IoReload } from "react-icons/io5";

interface RideListProps {
	orders: Order[];
	activeTab: string;
	onAccept: (id: string, src: string, dest: string, price: string) => void;
	onReject: (id: string) => void;
	onSelect: (order: Order) => void;
}

export function RideList({ orders, activeTab, onAccept, onReject, onSelect }: RideListProps) {
	// Get the appropriate icon based on active tab
	const getTabIcon = () => {
		switch (activeTab) {
			case "Upcoming":
				return <FaClock className="text-5xl text-blue-500 mb-4" />;
			case "Accepted":
				return <FaCarSide className="text-5xl text-green-500 mb-4" />;
			case "Completed":
				return <FaCheckCircle className="text-5xl text-purple-500 mb-4" />;
			default:
				return null;
		}
	};

	return (
		<>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-semibold">
					{activeTab === "Upcoming" ? "Live Ride Requests" : activeTab === "Accepted" ? "Accepted Rides" : "Completed Rides"}
				</h2>
				<button
					className="flex items-center space-x-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm transition-colors"
					onClick={() => window.location.reload()}
				>
					<IoReload className="text-gray-600" />
					<span>Refresh</span>
				</button>
			</div>

			<div className="space-y-4">
				{orders.length > 0 ? (
					orders.map((order) => (
						<BookVehicle
							key={order.id}
							order={order}
							onAccept={() => onAccept(order.id, order.pickupAddress, order.dropAddress, order.price)}
							onReject={() => onReject(order.id)}
							onSelect={() => onSelect(order)}
							showActions={activeTab === "Upcoming"}
						/>
					))
				) : (
					<div className="bg-gradient-to-b from-gray-100 to-white rounded-lg p-10 text-center shadow-md border border-gray-200">
						<div className="flex flex-col items-center">
							{getTabIcon()}

							<h3 className="text-xl font-medium text-gray-800 mb-2">
								{activeTab === "Upcoming"
									? "No ride requests available"
									: activeTab === "Accepted"
										? "No accepted rides"
										: "No completed rides"}
							</h3>

							<p className="text-gray-500 max-w-md mx-auto mb-4">
								{activeTab === "Upcoming"
									? "New ride requests will appear here when they become available. Check back soon!"
									: activeTab === "Accepted"
										? "Rides you accept will appear here for easy access and navigation."
										: "Your ride history will be displayed here after you complete rides."}
							</p>

							{activeTab === "Upcoming" && (
								<button
									onClick={() => window.location.reload()}
									className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
								>
									Check for new rides
								</button>
							)}
						</div>
					</div>
				)}
			</div>
		</>
	);
};