import { Order } from './types';
import BookVehicle from "@/app/components/book_vehicle/BookVehicle";

interface RideListProps {
  orders: Order[];
  activeTab: string;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onSelect: (order: Order) => void;
}

export const RideList: React.FC<RideListProps> = ({
  orders,
  activeTab,
  onAccept,
  onReject,
  onSelect
}) => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">
        {activeTab === "Upcoming" ? "Live Ride Requests" : "Choose a ride"}
      </h2>
      <div className="space-y-4">
        {orders?.map((order) => (
          <BookVehicle
            key={order.id}
            order={order}
            onAccept={() => onAccept(order.id)}
            onReject={() => onReject(order.id)}
            onSelect={() => onSelect(order)}
            showActions={activeTab === "Upcoming"}
          />
        ))}
      </div>
    </>
  );
};