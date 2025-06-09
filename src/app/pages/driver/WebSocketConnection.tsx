import { WebSocketMessage } from './types';
import { toast } from 'react-toastify';
const WEBSOCKET_URL = 'ws://localhost:7777';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(
    private onMessage: (data: WebSocketMessage) => void,
    private onError: (error: Event) => void,
    private driverId?: string
  ) { }

  connect() {
    this.ws = new WebSocket(WEBSOCKET_URL);

    this.ws.onopen = () => {
      console.log('WebSocket Connected');

      // Notify about connection establishment
      this.onMessage({
        type: 'CONNECTION_ESTABLISHED'
      });

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

        if (data.type === 'NEW_RIDE_REQUEST') {
          toast.info("A new ride request", {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
        }

        this.onMessage(data);
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

}