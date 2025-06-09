"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Order } from "./types";
import "leaflet/dist/leaflet.css"; // Important: Make sure this is included
import { FaMapMarked, FaRoute, FaLocationArrow, FaInfoCircle } from "react-icons/fa";

interface MapPlaceholderProps {
  selectedRide: Order | null;
}

// Dynamically import the MapContainer to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-[450px] bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600 font-medium">Loading map...</p>
    </div>
  )
});

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ selectedRide }) => {
  // Force re-render of the map when the selected ride changes
  const mapKey = selectedRide ? selectedRide.id : 'no-ride';

  // Fix for potential Leaflet issues with Next.js
  useEffect(() => {
    // Fix for Leaflet map container rendering issues
    window.dispatchEvent(new Event('resize'));
  }, [selectedRide]);

  return (
    <div className="w-full h-[500px] bg-white rounded-xl shadow-md overflow-hidden relative border border-gray-200">
      {selectedRide ? (
        <>
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FaRoute className="text-blue-300" />
              <div>
                <h3 className="text-lg font-semibold">Active Ride Map</h3>
                <p className="text-xs text-blue-200">ID: {selectedRide.id.substring(0, 8)}</p>
              </div>
            </div>
            <div className="bg-blue-700 py-1 px-3 rounded-full text-xs font-medium">
              {selectedRide.category}
            </div>
          </div>

          <div className="h-[442px] w-full relative" id="map-container">
            <MapWithNoSSR selectedRide={selectedRide} key={mapKey} />

            {/* Floating info box */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200" style={{ zIndex: 1000 }}>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaLocationArrow className="text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-bold mb-1 text-gray-800">
                    Trip Details
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">From:</span> {selectedRide.pickupAddress.split(',')[0]}
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">To:</span> {selectedRide.dropAddress.split(',')[0]}
                  </div>
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block mt-1">
                    {selectedRide.price}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FaMapMarked className="text-gray-300" />
              <div>
                <h3 className="text-lg font-semibold">Area Overview</h3>
                <p className="text-xs text-gray-300">Your current location</p>
              </div>
            </div>
          </div>

          <div className="h-[442px] w-full relative" id="map-container">
            <MapWithNoSSR selectedRide={null} key="demo-map" />

            {/* Tip box */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs" style={{ zIndex: 1000 }}>
              <div className="flex items-start space-x-3">
                <div className="mt-1 text-blue-500">
                  <FaInfoCircle />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1 text-gray-800">
                    Tip: Select a ride
                  </div>
                  <div className="text-xs text-gray-600">
                    Choose a ride from the list to view detailed route information on this map.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};