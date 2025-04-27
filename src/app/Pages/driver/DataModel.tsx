type Order = {
  id: string;
  category: string;
  price: string;
  pickupDate: string;
  pickupAddress: string;
  dropDate: string;
  dropAddress: string;
};

export const mockOrders: Record<string, Order[]> = {
  Completed: [
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