
import { useState, useEffect } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

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
      
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg p-4 shadow-lg mt-6">
        {loading ? (
          <div className="flex flex-col items-center">
            {/* Loading*/}
            <img src="/home/car.gif" alt="Loading" className="w-28 h-28 mb-4" />
            <p className="text-lg">Processing payment...</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center">
            <IoMdCheckmarkCircleOutline className="text-green-500 text-4xl mb-2" />
            <p className="text-lg font-semibold ">Successfully deducted ₹10 from the order.</p>
            <button onClick={onClose} className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg">
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="text-lg mb-4">Do you want to deduct ₹10 from this order?</p>
            <div className="flex space-x-4">
              <button onClick={handleConfirm} className="bg-green-500 text-white px-4 py-2 rounded-lg">
                Yes
              </button>
              <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                No
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ConfirmationModal;
