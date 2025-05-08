import { Location } from "./types";

const UPDATE_LOCATION_URL = 'http://localhost:7777/updateDriverLocation';

export class LocationService {
  private watchId: number | null = null;
  private driverId: string | undefined;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(driverId?: string) {
    this.driverId = driverId;
  }

  startTracking(intervalSeconds: number = 30) {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      return;
    }

    // Clear any existing tracking
    this.stopTracking();

    // Set up regular location updates
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentLocation: Location = {
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString()
        };

        this.sendLocationUpdate(currentLocation);
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,  // 10 seconds
        maximumAge: 0
      }
    );

    // Additional backup interval in case watchPosition doesn't fire regularly
    this.updateInterval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation: Location = {
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString()
          };
          this.sendLocationUpdate(currentLocation);
        },
        (error) => {
          console.error('Interval location error:', error);
        },
        { enableHighAccuracy: true }
      );
    }, intervalSeconds * 1000);
  }

  stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  async sendLocationUpdate(location: Location) {
    if (!this.driverId) {
      console.warn('Driver ID not set, cannot update location');
      return;
    }
    console.log(location);

    try {

      const response = await fetch(`${UPDATE_LOCATION_URL}/${this.driverId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(location)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log('Driver location updated successfully');
    } catch (error) {
      console.error('Failed to update driver location:', error);
    }
  }

  updateDriverId(driverId: string) {
    this.driverId = driverId;
  }
}