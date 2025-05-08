
// "use client";
// import { useState } from "react";
// import { FaRegThumbsUp, FaRegThumbsDown, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
// import ConfirmationModal from "./ConfirmationModal";

// type Order = {
//   id: string;
//   category: string;
//   price: string;
//   pickupDate: string;
//   pickupAddress: string;
//   dropDate: string;
//   dropAddress: string;
// };

// function BookVehicle({
//   order,
//   onAccept,
//   onReject,
//   showActions,
//   onSelect,
// }: {
//   order: Order;
//   onAccept: (id: string) => void;
//   onReject: (id: string) => void;
//   showActions: boolean;
//   onSelect: () => void;
// }) {
//   const [isLiked, setIsLiked] = useState(false);
//   const [isRejected, setIsRejected] = useState(false);
//   const [showDialog, setShowDialog] = useState(false);

//   const handleContainerClick = () => {
//     if (!showDialog && !isLiked && !isRejected) {
//       onSelect();
//     }
//   };

//   const handleThumbsUpClick = (event: React.MouseEvent) => {
//     event.stopPropagation(); 
//     if (!isLiked) setShowDialog(true);
//   };

//   const handleAccept = () => {
//     setIsLiked(true);
//     onAccept(order.id);
//   };

//   const handleReject = (event: React.MouseEvent) => {
//     event.stopPropagation(); 
//     setIsRejected(true);
//     onReject(order.id);
//   };

//   const handleDialogClose = () => {
//     setShowDialog(false);
//   };

//   return (
//     <div
//       className="bg-white rounded-lg shadow-md flex items-center hover:border hover:border-black hover:font-semibold"
//       onClick={handleContainerClick} 
//     >
//       <div className="w-1/3">
//         <img
//           src="/driver/car.jpg"
//           alt="car"
//           className="rounded-lg object-cover h-full w-full"
//         />
//       </div>

//       <div className="w-2/3 flex flex-col justify-between relative">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <div>
//             <p className="md:text-lg text-gray-500">{order.category}</p>
//           </div>
//           <span className="font-bold text-xl mr-5 -mt-6">{order.price}</span>
//         </div>

//         {/* Vertical Line */}
//         <div className="relative">
//           <div className="absolute left-[59px] md:top-5 top-6 bottom-3 w-0.5 bg-black"></div>

//           {/* First Address */}
//           <div className="flex items-center space-x-2 mt-2">
//             <p className="text-md font-medium text-gray-500">{order.pickupDate}</p>
//             <span className="w-2 h-2 bg-black rounded-full"></span>
//             <p className="md:text-lg text-gray-700">{order.pickupAddress}</p>
//           </div>

//           {/* Second Address */}
//           <div className="flex items-center space-x-2 mt-2">
//             <p className="text-md font-medium text-gray-500">{order.dropDate}</p>
//             <span className="w-2 h-2 bg-black rounded-full"></span>
//             <p className="md:text-lg text-gray-700">{order.dropAddress}</p>
//           </div>
//         </div>

//         {/* Thumbs Up/Down  */}
//         {showActions && (
//           <div className="flex space-x-4 mt-4 ml-56 md:ml-80">
//             <button
//               onClick={handleThumbsUpClick}
//               className={`text-green-500 text-2xl ${isRejected ? "opacity-50 cursor-not-allowed" : ""}`}
//               disabled={isRejected} 
//             >
//               {isLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
//             </button>
//             <button
//               onClick={handleReject}
//               className={`text-red-500 text-2xl ${isLiked ? "opacity-50 cursor-not-allowed" : ""}`}
//               disabled={isLiked} 
//             >
//               {isRejected ? <FaThumbsDown /> : <FaRegThumbsDown />}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={showDialog}
//         onClose={handleDialogClose}
//         onConfirm={handleAccept} 
//       />
//     </div>
//   );
// }

// export default BookVehicle;



"use client";
import { useState } from "react";
import { FaRegThumbsUp, FaRegThumbsDown, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModal";

type Order = {
  id: string;
  category: string;
  price: string;
  pickupDate: string;
  pickupAddress: string;
  dropDate: string;
  dropAddress: string;
};

function BookVehicle({
  order,
  onAccept,
  onReject,
  showActions,
  onSelect,
}: {
  order: Order;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  showActions: boolean;
  onSelect: () => void;
}) {
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

