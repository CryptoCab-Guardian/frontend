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
  
  export interface Location {
    lat: string;
    lng: string;
  }
  
  export interface WebSocketMessage {
    type: 'NEW_RIDE_REQUEST' | 'RIDE_CANCELLED' | 'DRIVER_CONNECT' | 'ACCEPT_RIDE' | 'REJECT_RIDE' | 'IDENTIFY';
    src?: Location;
    dest?: Location;
    distance?: string;
    ride?: Order;
    rideId?: string;
    driverId?: string;
  }