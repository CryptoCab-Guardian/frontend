import { Order } from './types';

interface RideDetailsProps {
  order: Order;
  onClose: () => void;
}

export const RideDetails: React.FC<RideDetailsProps> = ({ order, onClose }) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white w-full">
      <button onClick={onClose} className="text-red-500 text-xl font-bold">
        &times;
      </button>
      <h2 className="text-2xl font-semibold">Ride Details</h2>
      <p><strong>Category:</strong> {order.category}</p>
      <p><strong>Price:</strong> {order.price}</p>
      <p><strong>Pickup Date:</strong> {order.pickupDate}</p>
      <p><strong>Pickup Address:</strong> {order.pickupAddress}</p>
      <p><strong>Drop Date:</strong> {order.dropDate}</p>
      <p><strong>Drop Address:</strong> {order.dropAddress}</p>
    </div>
  );
};