"use client";
import { useState } from "react";
import { FaRegThumbsUp, FaRegThumbsDown, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModal";

type Order = {
  id: string;
  category: string;
  price: string;
  pickupAddress: string;
  dropAddress: string;
  dropDate?: string;
  pickupDate?: string;
};

interface BookVehicleProps {
  order: Order;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  showActions: boolean;
  onSelect: () => void;
}

function BookVehicle({ order, onAccept, onReject, showActions, onSelect }: BookVehicleProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleContainerClick = () => {
    if (!showDialog && !isLiked && !isRejected) {
      onSelect();
    }
  };

  const handleThumbsUpClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLiked) setShowDialog(true);
  };

  const handleAccept = () => {
    setIsLiked(true);
    onAccept(order.id);
    setShowDialog(false);
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRejected(true);
    onReject(order.id);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  return (
    <div
      className="bg-black text-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      onClick={handleContainerClick}
    >
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {/* Image */}
        <div className="col-span-1">
          <img
            src="/driver/car.jpg"
            alt="car"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="col-span-2 md:col-span-3 p-4 flex flex-col justify-between space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <span className="text-lg uppercase tracking-wide text-gray-300">{order.category}</span>
            <span className="text-2xl font-bold text-white">{order.price}</span>
          </div>

          {/* Trip Details */}
          <div className="space-y-3 text-sm md:text-base">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>{order.pickupAddress}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>{order.dropAddress}</span>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={handleThumbsUpClick}
                disabled={isRejected}
                className={`text-2xl ${isRejected ? "opacity-50 cursor-not-allowed" : "text-green-400 hover:text-green-300"}`}
              >
                {isLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
              </button>
              <button
                onClick={handleReject}
                disabled={isLiked}
                className={`text-2xl ${isLiked ? "opacity-50 cursor-not-allowed" : "text-red-400 hover:text-red-300"}`}
              >
                {isRejected ? <FaThumbsDown /> : <FaRegThumbsDown />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <ConfirmationModal
        isOpen={showDialog}
        onClose={handleDialogClose}
        onConfirm={handleAccept}
      />
    </div>
  );
}

export default BookVehicle;

