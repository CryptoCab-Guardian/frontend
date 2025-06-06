type Order = {
  id: string;
  category: string;
  price: string;
  pickupAddress: string;
  dropAddress: string;
};

export const mockOrders: Record<string, Order[]> = {
  Completed: [
    {
      id: "816495",
      category: "RIDE COMPLETED",
      price: "₹250",
      pickupAddress: "Howrah Maiden, Howrah",
      dropAddress: "South Talbagicha, Kharagpur, Mednipur West",
    },
  ],
  Accepted: [
  ],
  Upcoming: [
    {
      id: "918372",
      category: "Furniture",
      price: "₹8,500.00",
      pickupAddress: "567 Oakwood Rd, Chicago, IL",
      dropAddress: "120 Maple Ave, Chicago, IL",
    },
  ],
};