
"use client";
import { useState } from "react";
import BookVehicle from "@/app/components/book_vehicle/BookVehicle";

type Order = {
  id: string;
  category: string;
  price: string;
  pickupDate: string;
  pickupAddress: string;
  dropDate: string;
  dropAddress: string;
};

const mockOrders: Record<string, Order[]> = {
  Delivered: [
    {
      id: "816495",
      category: "Food",
      price: "₹4,198.06",
      pickupDate: "23 Apr",
      pickupAddress: "821 Jadloc Parkway, Calumet City, IL",
      dropDate: "25 Apr",
      dropAddress: "982 Cemij View",
    },
  ],
  Accepted: [
    {
      id: "764399",
      category: "Groceries",
      price: "₹1,250.00",
      pickupDate: "22 Apr",
      pickupAddress: "100 Main St, Springfield, IL",
      dropDate: "23 Apr",
      dropAddress: "205 Elm St, Springfield, IL",
    },
  ],
  Upcoming: [
    {
      id: "918372",
      category: "Furniture",
      price: "₹8,500.00",
      pickupDate: "29 Apr",
      pickupAddress: "567 Oakwood Rd, Chicago, IL",
      dropDate: "30 Apr",
      dropAddress: "120 Maple Ave, Chicago, IL",
    },
    {
      id: "918375",
      category: "Furniture",
      price: "₹8,800.00",
      pickupDate: "30 Apr",
      pickupAddress: "567 Oakwood Rd, IL",
      dropDate: "31 Apr",
      dropAddress: "12 Maple Ave, Chicago, IL",
    },
  ],
};

export default function Drive() {
  type TabType = "Completed" | "Accepted" | "Upcoming";
  const [activeTab, setActiveTab] = useState<TabType>("Upcoming");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleAccept = (id: string) => {
    console.log(`Accepted order ID: ${id}`);
  };

  const handleReject = (id: string) => {
    console.log(`Rejected order ID: ${id}`);
  };

  const orders = mockOrders[activeTab];

  return (
    <div className="min-h-screen bg-gray-100 p-3">
      <div className="flex justify-between max-w-7xl mx-auto">
        <div className="flex justify-center space-x-4 mt-8 mb-6">
          {(["Upcoming", "Accepted", "Completed"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab ? "bg-black text-white" : "bg-gray-200 text-black"
              } transition-colors`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="text-lg font-bold mt-8 mb-6">Current Amount: 0.00</div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col-reverse md:flex-row items-start mx-auto max-w-7xl mb-12 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex flex-col items-start space-y-4 w-full md:w-1/2 mt-5 md:mt-0">
          {selectedOrder ? (
            // Ride Details
            <div className="space-y-4 p-4 border rounded-lg bg-white w-full ">
              <button onClick={() => setSelectedOrder(null)} className="text-red-500 text-xl font-bold">
                &times;
              </button>
              <h2 className="text-2xl font-semibold">Ride Details</h2>
              <p><strong>Category:</strong> {selectedOrder.category}</p>
              <p><strong>Price:</strong> {selectedOrder.price}</p>
              <p><strong>Pickup Date:</strong> {selectedOrder.pickupDate}</p>
              <p><strong>Pickup Address:</strong> {selectedOrder.pickupAddress}</p>
              <p><strong>Drop Date:</strong> {selectedOrder.dropDate}</p>
              <p><strong>Drop Address:</strong> {selectedOrder.dropAddress}</p>
            </div>
          ) : (
            // Ride Selection List
            <>
              <h2 className="text-2xl font-semibold mb-4">Choose a ride</h2>
              <div className="space-y-4">
                {orders.map((order) => (
                  <BookVehicle
                    key={order.id}
                    order={order}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onSelect={() => setSelectedOrder(order)} 
                    showActions={activeTab === "Upcoming"}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {/* Map Holder */}
        <div className="w-full md:w-1/2 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Map Placeholder</p>
        </div>
      </div>
    </div>
  );
}
