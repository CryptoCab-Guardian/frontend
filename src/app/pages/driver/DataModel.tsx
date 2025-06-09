type Order = {
  id: string;
  category: string;
  price: string;
  pickupAddress: string;
  dropAddress: string;
};

// Create empty order collections for different statuses
export const mockOrders: Record<string, Order[]> = {
  Completed: [],
  Accepted: [],
  Upcoming: [],
};