export type Order = {
  id: string;
  category: string;
  price: string;
  pickupAddress: string;
  dropAddress: string;
};

export type TabType = "Completed" | "Accepted" | "Upcoming";

export interface Location {
  lat: string;
  lng: string;
}

export interface WebSocketMessage {
  type: 'NEW_RIDE_REQUEST' | 'RIDE_CANCELLED' | 'DRIVER_CONNECT' | 'ACCEPT_RIDE' | 'REJECT_RIDE' | 'IDENTIFY' | 'CONNECTION_ESTABLISHED';
  src?: Location;
  dest?: Location;
  distance?: string;
  ride?: Order;
  rideId?: string;
  driverId?: string;
  price?: string;
}

export async function getAddressFromCoordinates(lat: string, lng: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`,
      {
        headers: {
          'User-Agent': 'DriverApp/1.0',
          'Accept-Language': 'en'
        }
      }
    );

    const data = await response.json();

    if (data && data.display_name) {
      // Parse the address and return only the first few parts
      // const addressParts = data.display_name.split(', ');
      // // Take first 2-3 parts of the address for a concise display
      // const shortAddress = addressParts.slice(0, 2).join(', ');
      console.log(data.display_name);
      return data.display_name;
    } else {
      console.error("Geocoding API error:", data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
}