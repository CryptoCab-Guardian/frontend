import { WebSocketMessage} from './types';

const WEBSOCKET_URL = 'ws://localhost:7777';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(
    private onMessage: (data: WebSocketMessage) => void,
    private onError: (error: Event) => void,
    private driverId?: string
  ) {}

  connect() {
    this.ws = new WebSocket(WEBSOCKET_URL);

    this.ws.onopen = () => {
      console.log('WebSocket Connected');
      
      // Send IDENTIFY message when connection opens
      if (this.driverId) {
        this.send({
          type: 'IDENTIFY',
          driverId: this.driverId
        });
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket message:', data);
        
        // Convert new format to Order if it's a ride request
        // if (data.type === 'NEW_RIDE_REQUEST' && data.src && data.dest) {
        //   // Generate a unique ID for the ride
        //   const rideId = Math.random().toString(36).substring(2, 15);
          
        //   // Convert to Order format
        //   const rideOrder: Order = {
        //     id: rideId,
        //     category: "Ride Request",
        //     price: calculatePrice(data.distance),
        //     pickupDate: new Date().toLocaleDateString(),
        //     pickupAddress: `${data.src.lat}, ${data.src.lng}`, // Format as needed
        //     dropDate: new Date().toLocaleDateString(),
        //     dropAddress: `${data.dest.lat}, ${data.dest.lng}`, // Format as needed
        //     // You can add additional fields if needed
        //     srcLocation: data.src, 
        //     destLocation: data.dest,
        //     distance: data.distance
        //   };
          
        //   // Update the data with the converted ride
        //   data.ride = rideOrder;
        // }
        
        // this.onMessage(data);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    this.ws.onerror = this.onError;

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.reconnect();
    };
  }

  send(message: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('Sending WebSocket message:', message);
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
    }
  }

  private reconnect() {
    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting to reconnect WebSocket...');
      this.connect();
    }, 5000);
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
  
  // // Helper function to calculate price based on distance
  // private calculatePrice(distance: string): string {
  //   // Basic calculation - you can make this more sophisticated
  //   const distanceNum = parseFloat(distance) || 0;
  //   const basePrice = 50; // Base fare
  //   const pricePerKm = 10; // Rate per km
  //   const totalPrice = basePrice + (distanceNum * pricePerKm);
  //   return `₹${totalPrice.toFixed(2)}`;
  // }
}