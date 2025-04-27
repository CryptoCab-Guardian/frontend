import { WebSocketMessage } from './types';

const WEBSOCKET_URL = 'wss://demo.example.com/driver-rides';

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
      if (this.driverId) {
        this.send({
          type: 'DRIVER_CONNECT',
          driverId: this.driverId
        });
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
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
      this.ws.send(JSON.stringify(message));
    }
  }

  private reconnect() {
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, 5000);
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.ws?.close();
  }
}