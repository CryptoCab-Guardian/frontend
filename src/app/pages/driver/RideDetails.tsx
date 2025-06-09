import { useState } from 'react';
import { Order } from './types';
import { toast } from 'react-toastify';
import { useAuth } from '@/app/hooks/useAuth';
import { FaArrowLeft, FaMapMarkerAlt, FaRegMoneyBillAlt, FaRoute, FaTag, FaUser, FaCheck } from 'react-icons/fa';
import { IoLocationOutline, IoLocationSharp } from "react-icons/io5";

interface RideDetailsProps {
  order: Order;
  onClose: () => void;
  onComplete?: (orderId: string) => void;
}

export const RideDetails: React.FC<RideDetailsProps> = ({
  order,
  onClose,
  onComplete
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { currentAccount } = useAuth();

  const handleCompleteRide = async () => {
    if (!currentAccount) {
      toast.error("You must be logged in to complete rides");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:7777/completeRide/${currentAccount}/${order.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to complete ride');
      }

      toast.success("Ride completed successfully!");

      if (onComplete) {
        onComplete(order.id);
      }
    } catch (error) {
      console.error("Error completing ride:", error);
      toast.error(`Failed to complete ride: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine the status color
  const getStatusColor = () => {
    if (order.category === "RIDE COMPLETED") return "bg-purple-600";
    if (order.category === "RIDE BOOKED") return "bg-green-600";
    return "bg-blue-600";
  };

  return (
    <div className="w-full">
      <div className="flex items-center space-x-2 mb-6">
        <button
          onClick={onClose}
          className="flex items-center justify-center p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          <FaArrowLeft className="text-gray-700" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Ride Details</h2>
      </div>

      {/* Status Badge */}
      <div className={`mb-6 inline-block px-4 py-2 rounded-full text-white font-medium ${getStatusColor()}`}>
        {order.category}
      </div>

      {/* Ride Info Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FaTag className="text-blue-400" />
              <span className="font-semibold">Ride #{order.id.substring(0, 8)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaRegMoneyBillAlt className="text-green-400" />
              <span className="font-bold text-green-400 text-xl">{order.price}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Locations */}
          <div className="space-y-6">
            {/* Pickup */}
            <div className="flex items-start space-x-3">
              <div className="mt-1 text-blue-500">
                <IoLocationOutline size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Pickup Location</p>
                <p className="text-gray-800 font-medium">{order.pickupAddress}</p>
              </div>
            </div>

            {/* Route Line */}
            <div className="flex justify-center">
              <div className="h-16 border-l-2 border-dashed border-gray-400"></div>
            </div>

            {/* Dropoff */}
            <div className="flex items-start space-x-3">
              <div className="mt-1 text-red-500">
                <IoLocationSharp size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Drop-off Location</p>
                <p className="text-gray-800 font-medium">{order.dropAddress}</p>
              </div>
            </div>
          </div>

          {/* Other Details */}
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-xs uppercase font-medium text-gray-600 mb-2">Additional Information</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaUser className="text-gray-500" />
                <span className="text-gray-800">Passenger Waiting</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaRoute className="text-gray-500" />
                <span className="text-gray-800">Direct Route</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {order.category === "RIDE BOOKED" ? (
        <button
          onClick={handleCompleteRide}
          disabled={isLoading}
          className={`w-full py-4 rounded-lg font-semibold transition-all shadow-md flex items-center justify-center space-x-2 ${isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600"
            }`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <>
              <FaCheck />
              <span>Complete Ride</span>
            </>
          )}
        </button>
      ) : order.category === "RIDE_COMPLETED" ? (
        <div className="bg-purple-100 border border-purple-300 rounded-lg p-4 text-center">
          <p className="text-purple-800 font-medium">This ride has been completed successfully.</p>
        </div>
      ) : (
        <button
          className="w-full py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
          onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(order.pickupAddress)}`, '_blank')}
        >
          Navigate to Pickup
        </button>
      )}
    </div>
  );
};