
"use client";
import React from 'react';
import dynamic from 'next/dynamic';

// Define the placeholder component that doesn't depend on leaflet
const PlaceholderBox = ({ 
  distance, 
  price,
  pickupLocation,
  dropoffLocation,
  routeGeometry
}: {
  pickupLocation?: { lat: number; lng: number; name: string };
  dropoffLocation?: { lat: number; lng: number; name: string };
  distance?: number;
  price?: string;
  routeGeometry?: string;
}) => (
  <div className="rounded-xl overflow-hidden shadow-lg h-[35rem] bg-gray-200 flex flex-col">
    {(pickupLocation && dropoffLocation) && (
      <div className="bg-white p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">Trip Details</h3>
            {distance && (
              <p className="text-gray-600">
                Distance: {distance.toFixed(1)} km
                {routeGeometry && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                    Actual Route
                  </span>
                )}
              </p>
            )}
            <p className="mt-2">
              <strong>From:</strong> {pickupLocation.name}<br />
              <strong>To:</strong> {dropoffLocation.name}
            </p>
          </div>
          {price && (
            <div className="text-xl font-bold text-green-600">{price}</div>
          )}
        </div>
      </div>
    )}
    <div className="flex-1 flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  </div>
);

// Use dynamic import with no-SSR option
const MapWithNoSSR = dynamic(
  () => import('./MapWithLeaflet'),
  { 
    loading: () => <PlaceholderBox />,
    ssr: false 
  }
);

interface MapPlaceholderProps {
  pickupLocation?: { lat: number; lng: number; name: string };
  dropoffLocation?: { lat: number; lng: number; name: string };
  distance?: number;
  price?: string;
  routeGeometry?: string;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = (props) => {
  // Pass all props to the dynamic component
  return <MapWithNoSSR {...props} />;
};

export default MapPlaceholder;