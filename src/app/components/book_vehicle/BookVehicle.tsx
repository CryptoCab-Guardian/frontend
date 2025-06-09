"use client";
import { useState } from "react";
import {
	FaRegThumbsUp,
	FaRegThumbsDown,
	FaThumbsUp,
	FaThumbsDown
} from "react-icons/fa";
import { IoLocationOutline, IoLocationSharp } from "react-icons/io5";
import { BiMoney } from "react-icons/bi";
import { BsCarFrontFill } from "react-icons/bs";
import ConfirmationModal from "./ConfirmationModal";
import Image from "next/image";

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
	onAccept: (id: string, src: string, dest: string, price: string) => void;
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
		onAccept(order.id, order.pickupAddress, order.dropAddress, order.price);
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
			className="bg-gradient-to-r from-gray-900 to-black text-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-800"
			onClick={handleContainerClick}
		>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-0">
				{/* Image */}
				<div className="md:col-span-1 relative">
					<Image
						src="/driver/car.jpg"
						alt="car"
						width={300}
						height={200}
						className="h-full w-full object-cover"
					/>
					<div className="absolute top-0 left-0 bg-gradient-to-r from-blue-600 to-blue-500 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-br-lg">
						{order.category}
					</div>
				</div>

				{/* Info */}
				<div className="md:col-span-3 p-5 flex flex-col justify-between space-y-4">
					{/* Header */}
					<div className="flex justify-between items-center">
						<div className="flex items-center space-x-2">
							<BsCarFrontFill className="text-blue-400" />
							<span className="text-lg font-semibold text-blue-400">{order.category} Ride</span>
						</div>
						<div className="flex items-center bg-blue-600/20 px-3 py-2 rounded-lg">
							<BiMoney className="text-green-400 mr-2" />
							<span className="text-xl font-bold text-green-400">{order.price}</span>
						</div>
					</div>

					{/* Trip Details */}
					<div className="space-y-0 text-sm md:text-base">
						{/* Pickup */}
						<div className="flex items-start space-x-3 p-2 rounded-lg transition-colors hover:bg-gray-800/40">
							<div className="mt-1">
								<IoLocationOutline className="text-blue-400 text-xl" />
							</div>
							<div className="flex-1">
								<p className="text-gray-400 text-xs font-medium uppercase tracking-wider">PICKUP</p>
								<p className="text-white font-medium">{order.pickupAddress}</p>
								{order.pickupDate && <p className="text-gray-400 text-xs">{order.pickupDate}</p>}
							</div>
						</div>

						{/* Route Line */}
						<div className="flex items-center pl-4 ml-1">
							<div className="h-10 border-l-2 border-dashed border-gray-600"></div>
						</div>

						{/* Dropoff */}
						<div className="flex items-start space-x-3 p-2 rounded-lg transition-colors hover:bg-gray-800/40">
							<div className="mt-1">
								<IoLocationSharp className="text-red-400 text-xl" />
							</div>
							<div className="flex-1">
								<p className="text-gray-400 text-xs font-medium uppercase tracking-wider">DROPOFF</p>
								<p className="text-white font-medium">{order.dropAddress}</p>
								{order.dropDate && <p className="text-gray-400 text-xs">{order.dropDate}</p>}
							</div>
						</div>
					</div>

					{/* Actions */}
					{showActions && (
						<div className="flex justify-end space-x-4 pt-2">
							<button
								onClick={handleThumbsUpClick}
								disabled={isRejected}
								className={`flex items-center justify-center rounded-full p-3 transition-all duration-300 
									${isRejected
										? "bg-gray-800 opacity-50 cursor-not-allowed"
										: "bg-green-500/20 text-green-400 hover:bg-green-500/30"}`}
							>
								{isLiked ? <FaThumbsUp className="text-xl" /> : <FaRegThumbsUp className="text-xl" />}
							</button>
							<button
								onClick={handleReject}
								disabled={isLiked}
								className={`flex items-center justify-center rounded-full p-3 transition-all duration-300 
									${isLiked
										? "bg-gray-800 opacity-50 cursor-not-allowed"
										: "bg-red-500/20 text-red-400 hover:bg-red-500/30"}`}
							>
								{isRejected ? <FaThumbsDown className="text-xl" /> : <FaRegThumbsDown className="text-xl" />}
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

