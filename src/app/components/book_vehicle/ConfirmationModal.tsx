import { useState, useEffect } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaCarSide, FaTimes, FaCheck, FaMapMarkerAlt, FaUser, FaRoute } from "react-icons/fa";

type ConfirmationModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
};

function ConfirmationModal({ isOpen, onClose, onConfirm }: ConfirmationModalProps) {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			setLoading(false);
			setSuccess(false);
		}
	}, [isOpen]);

	const handleConfirm = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setSuccess(true);
			onConfirm();
		}, 1500);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[9999] px-4">
			<div className="bg-gradient-to-b from-gray-900 to-black text-white rounded-xl shadow-2xl max-w-md w-full border border-gray-800 overflow-hidden">
				{loading ? (
					<div className="flex flex-col items-center py-10">
						{/* Loading animation */}
						<div className="relative w-24 h-24 mb-6">
							<div className="absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent animate-spin"></div>
							<div className="absolute inset-0 flex items-center justify-center">
								<FaCarSide className="text-blue-400 text-3xl animate-pulse" />
							</div>
						</div>
						<p className="text-xl font-medium text-gray-200 animate-pulse">Accepting ride request...</p>
					</div>
				) : success ? (
					<div className="flex flex-col items-center py-10">
						<div className="w-20 h-20 flex items-center justify-center bg-green-900/50 rounded-full p-4 mb-4 animate-bounce">
							<IoMdCheckmarkCircleOutline className="text-green-400 text-5xl" />
						</div>
						<p className="text-xl font-semibold text-gray-100 mb-3">Ride accepted successfully!</p>
						<p className="text-sm text-gray-400 mb-8 text-center max-w-xs">
							You can now navigate to the pickup location. The passenger has been notified.
						</p>
						<button
							onClick={onClose}
							className="w-full max-w-xs bg-gradient-to-r from-green-700 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-500 transition-all"
						>
							Start Navigation
						</button>
					</div>
				) : (
					<>
						{/* Header */}
						<div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-4">
							<div className="flex justify-between items-center">
								<h3 className="text-xl font-semibold text-white">Accept Ride Request?</h3>
								<button
									onClick={onClose}
									className="text-gray-300 hover:text-white transition-colors"
								>
									<FaTimes />
								</button>
							</div>
						</div>

						{/* Content */}
						<div className="p-6">
							<div className="mb-6 space-y-4">
								<p className="text-gray-300 border-l-4 border-blue-500 pl-3 py-1">
									You're about to accept this ride request. Please confirm to proceed.
								</p>

								<div className="bg-blue-900/20 rounded-lg p-4 space-y-3">
									<div className="flex items-start space-x-3">
										<FaUser className="text-blue-400 mt-1" />
										<div>
											<p className="text-xs text-gray-400 uppercase">Passenger</p>
											<p className="text-white">Ready for pickup</p>
										</div>
									</div>

									<div className="flex items-start space-x-3">
										<FaMapMarkerAlt className="text-blue-400 mt-1" />
										<div>
											<p className="text-xs text-gray-400 uppercase">Destination</p>
											<p className="text-white">Will be displayed after acceptance</p>
										</div>
									</div>

									<div className="flex items-start space-x-3">
										<FaRoute className="text-blue-400 mt-1" />
										<div>
											<p className="text-xs text-gray-400 uppercase">Trip Details</p>
											<p className="text-white">Full details will be available after confirmation</p>
										</div>
									</div>
								</div>
							</div>

							<div className="flex space-x-4">
								<button
									onClick={onClose}
									className="flex-1 border border-gray-700 text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
								>
									Cancel
								</button>
								<button
									onClick={handleConfirm}
									className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-3 rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg"
								>
									<FaCheck className="mr-2" />
									Accept Ride
								</button>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default ConfirmationModal;
