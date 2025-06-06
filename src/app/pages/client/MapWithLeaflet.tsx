

"use client";
import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet icon issues in Next.js
const icon = L.icon({
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Function to decode the polyline from OSRM
function decodePolyline(str: string, precision: number = 5) {
  let index = 0;
  let lat = 0;
  let lng = 0;
  const coordinates = [];
  let shift = 0;
  let result = 0;
  let byte = null;
  let latitude_change;
  let longitude_change;
  const factor = Math.pow(10, precision);

  while (index < str.length) {
    byte = null;
    shift = 0;
    result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

    shift = result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

    lat += latitude_change;
    lng += longitude_change;

    coordinates.push([lat / factor, lng / factor]);
  }

  return coordinates;
}

// Map updater component to adjust view when locations change
function MapUpdater({
  pickupLocation,
  dropoffLocation,
  routePoints,
}: {
  pickupLocation?: { lat: number; lng: number };
  dropoffLocation?: { lat: number; lng: number };
  routePoints?: [number, number][];
}) {
  const map = useMap();
  
  useEffect(() => {
    if (pickupLocation && dropoffLocation) {
      if (routePoints && routePoints.length > 0) {
        // Create bounds that include all route points
        const bounds = L.latLngBounds(routePoints);
        map.fitBounds(bounds, { padding: [50, 50] });
      } else {
        // Fallback to just the two markers
        const bounds = L.latLngBounds(
          [pickupLocation.lat, pickupLocation.lng],
          [dropoffLocation.lat, dropoffLocation.lng]
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [map, pickupLocation, dropoffLocation, routePoints]);
  
  return null;
}

interface MapProps {
  pickupLocation?: { lat: number; lng: number; name: string };
  dropoffLocation?: { lat: number; lng: number; name: string };
  distance?: number;
  price?: string;
  routeGeometry?: string;
}

const MapWithLeaflet: React.FC<MapProps> = ({
  pickupLocation,
  dropoffLocation,
  distance,
  price,
  routeGeometry
}) => {
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const hasLocations = pickupLocation && dropoffLocation;
  
  // Process route geometry when it changes
  useEffect(() => {
    if (routeGeometry && pickupLocation && dropoffLocation) {
      try {
        console.log("Decoding route geometry...");
        // Decode the polyline to get coordinates
        const decoded = decodePolyline(routeGeometry);
        console.log(`Route has ${decoded.length} points`);
        
        // Convert format to what Leaflet expects [lat, lng]
        setRoutePoints(decoded as [number, number][]);
      } catch (error) {
        console.error("Error decoding route geometry:", error);
        // Fallback to direct line
        console.warn("Falling back to direct line for route display");
        setRoutePoints([
          [pickupLocation.lat, pickupLocation.lng],
          [dropoffLocation.lat, dropoffLocation.lng]
        ]);
      }
    } else if (pickupLocation && dropoffLocation) {
      // If no geometry but we have locations, use direct line
      console.warn("No route geometry provided, using direct line");
      setRoutePoints([
        [pickupLocation.lat, pickupLocation.lng],
        [dropoffLocation.lat, dropoffLocation.lng]
      ]);
    }
  }, [routeGeometry, pickupLocation, dropoffLocation]);
  
  // Default center (use a major city)
  const defaultCenter: [number, number] = [51.505, -0.09]; // London
  
  // Calculate center from locations or use default
  const center = hasLocations
    ? [(pickupLocation.lat + dropoffLocation.lat) / 2, (pickupLocation.lng + dropoffLocation.lng) / 2] as [number, number]
    : defaultCenter;
  
  // Calculate estimated time based on distance
  const estimatedMinutes = distance ? Math.ceil(distance / 50 * 60) : null;
  
  return (
    <div className="rounded-xl overflow-hidden shadow-lg h-[35rem]">
      {hasLocations && (
        <div className="bg-white p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Trip Details</h3>
              <div className="mt-1">
                {distance && (
                  <>
                    <p className="text-gray-600">
                      Distance: {distance.toFixed(1)} km
                      {routeGeometry && (
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                          Actual Route
                        </span>
                      )}
                      {!routeGeometry && (
                        <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                          Straight Line
                        </span>
                      )}
                    </p>
                    <p className="text-gray-600">Est. time: {estimatedMinutes} min</p>
                  </>
                )}
                <p className="mt-2">
                  <strong>From:</strong> {pickupLocation.name}<br />
                  <strong>To:</strong> {dropoffLocation.name}
                </p>
              </div>
            </div>
            {price && (
              <div className="text-xl font-bold text-green-600 ml-4">{price}</div>
            )}
          </div>
        </div>
      )}
      
      <div style={{ height: hasLocations ? "calc(100% - 140px)" : "100%" }}>
        <MapContainer 
          key={`${pickupLocation?.name || 'default'}-${dropoffLocation?.name || 'default'}`}
          center={center}
          zoom={13}
          style={{ height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {pickupLocation && (
            <Marker 
              position={[pickupLocation.lat, pickupLocation.lng]} 
              icon={icon}
            >
              <Popup>
                <strong>Pickup:</strong> {pickupLocation.name}
              </Popup>
            </Marker>
          )}
          
          {dropoffLocation && (
            <Marker 
              position={[dropoffLocation.lat, dropoffLocation.lng]} 
              icon={icon}
            >
              <Popup>
                <strong>Dropoff:</strong> {dropoffLocation.name}
              </Popup>
            </Marker>
          )}
          
          {routePoints.length > 0 && (
            <Polyline 
              positions={routePoints}
              color="blue"
              weight={4}
              opacity={0.7}
            />
          )}
          
          <MapUpdater 
            pickupLocation={pickupLocation} 
            dropoffLocation={dropoffLocation} 
            routePoints={routePoints}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapWithLeaflet;