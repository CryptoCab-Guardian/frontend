"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Order } from "./types";
import "leaflet/dist/leaflet.css"; // Important: Make sure this is included

interface MapPlaceholderProps {
  selectedRide: Order | null;
}

// Dynamically import the MapContainer to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[450px] bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
    </div>
  )
});

// Update only the no-ride-selected section

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ selectedRide }) => {
  // Force re-render of the map when the selected ride changes
  const mapKey = selectedRide ? selectedRide.id : 'no-ride';
  
  // Fix for potential Leaflet issues with Next.js
  useEffect(() => {
    // Fix for Leaflet map container rendering issues
    window.dispatchEvent(new Event('resize'));
  }, [selectedRide]);

  return (
    <div className="w-full md:w-1/2 h-[500px] bg-white rounded-lg shadow-md overflow-hidden relative">
      {selectedRide ? (
        <>
          <div className="p-3 bg-gray-800 text-white">
            <h3 className="text-lg font-semibold">Ride Map</h3>
            <p className="text-sm opacity-75">{selectedRide.category}</p>
          </div>
          
          <div className="h-[450px] w-full" id="map-container">
            <MapWithNoSSR selectedRide={selectedRide} key={mapKey} />
          </div>
          
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md" style={{ zIndex: 1000 }}>
            <div className="text-sm font-medium mb-1">
              Price: {selectedRide.price}
            </div>
            <div className="text-xs text-gray-500">
              Ride ID: {selectedRide.id.substring(0, 8)}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="p-3 bg-gray-800 text-white">
            <h3 className="text-lg font-semibold">Area Overview</h3>
            <p className="text-sm opacity-75">Demo map view</p>
          </div>
          
          <div className="h-[450px] w-full" id="map-container">
            <MapWithNoSSR selectedRide={null} key="demo-map" />
          </div>
          
          <div className="absolute top-14 left-4 bg-white p-3 rounded-lg shadow-md" style={{ zIndex: 1000 }}>
            <div className="text-sm font-medium mb-1">
              <span className="text-blue-600">💡 Tip:</span> Select a ride from the list to view its details on the map
            </div>
          </div>
        </>
      )}
    </div>
  );
};