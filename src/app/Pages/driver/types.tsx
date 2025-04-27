export type Order = {
    id: string;
    category: string;
    price: string;
    pickupDate: string;
    pickupAddress: string;
    dropDate: string;
    dropAddress: string;
  };
  
  export type TabType = "Completed" | "Accepted" | "Upcoming";
  
  export interface WebSocketMessage {
    type: 'NEW_RIDE_REQUEST' | 'RIDE_CANCELLED' | 'DRIVER_CONNECT' | 'ACCEPT_RIDE' | 'REJECT_RIDE';
    ride?: Order;
    rideId?: string;
    driverId?: string;
  }