"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Tooltip, Circle } from "react-leaflet";
import L from "leaflet";
import { Order } from "./types";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  selectedRide: Order | null;
}

// Component to handle map view updates when center changes
const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
    setTimeout(() => {
      // Force map to recalculate size after rendering
      map.invalidateSize();
    }, 100);
  }, [center, zoom, map]);
  return null;
};

interface RoutePoint {
  lat: number;
  lng: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ selectedRide }) => {
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [dropCoords, setDropCoords] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]); // Default to Delhi
  const [isLoading, setIsLoading] = useState(true);
  const [mapZoom, setMapZoom] = useState(14); // Default to closer zoom for current location
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [routeDistance, setRouteDistance] = useState<string>("");
  const [showingDemo, setShowingDemo] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>(""); // For storing reverse geocoded address

  // Get driver's current location on initial load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
          
          // Always center the map on the driver's location when no ride is selected
          if (!selectedRide) {
            setMapCenter([latitude, longitude]);
          }
          
          // Reverse geocode to get the current address
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
              if (data && data.display_name) {
                setCurrentAddress(data.display_name);
              }
            })
            .catch(err => {
              console.error("Error reverse geocoding:", err);
              setCurrentAddress("Your current location");
            });
          
          setLocationError(null);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError(error.message);
          // Keep the default location
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, [selectedRide]);

  // Fix Leaflet default icon issue
  useEffect(() => {
    // only run on client
    if (typeof window !== 'undefined') {
      // Fix the default icon issue
      delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    }
  }, []);

  // Function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  // Format distance nicely
  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  useEffect(() => {
    const loadCoordinates = async () => {
      setIsLoading(true);
      
      if (!selectedRide) {
        // No ride selected, only show current location
        // Use current location if available, otherwise default to Delhi
        if (currentLocation) {
          setMapCenter(currentLocation);
          setMapZoom(15); // Close zoom for current location view
        } else {
          // If geolocation failed, we'll still use Delhi as fallback
          setMapCenter([28.6139, 77.2090]);
          setMapZoom(13);
        }
        
        // Clear any previous route data since we're just showing current location
        setPickupCoords(null);
        setDropCoords(null);
        setRoutePoints([]);
        setRouteDistance("");
        setShowingDemo(false);
        
        setIsLoading(false);
        return;
      }
      
      // A ride is selected, so load its coordinates
      setShowingDemo(false);

      try {
        // Use Nominatim API for geocoding (OpenStreetMap's geocoding service)
        const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
            );
            
            if (!response.ok) {
              throw new Error(`Geocoding API error: ${response.status}`);
            }
            
            const data = await response.json();
            if (data && data.length > 0) {
              return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            }
            return null;
          } catch (error) {
            console.error("Error geocoding address:", error);
            return null;
          }
        };
        
        // Geocode both addresses
        const pCoordsResult = await geocodeAddress(selectedRide.pickupAddress);
        const dCoordsResult = await geocodeAddress(selectedRide.dropAddress);
        
        // Use fallback coordinates if geocoding fails
        const pCoords = pCoordsResult || (currentLocation ? [currentLocation[0] + 0.01, currentLocation[1] + 0.01] : [28.6139, 77.2090]);
        const dCoords = dCoordsResult || (currentLocation ? [currentLocation[0] - 0.01, currentLocation[1] - 0.01] : [28.6329, 77.2195]);
        
        setPickupCoords(pCoords);
        setDropCoords(dCoords);
        
        // Center the map between the two points
        setMapCenter([
          (pCoords[0] + dCoords[0]) / 2,
          (pCoords[1] + dCoords[1]) / 2
        ]);
        
        // Calculate straight-line distance
        const directDistance = calculateDistance(
          pCoords[0], pCoords[1], 
          dCoords[0], dCoords[1]
        );
        
        // Get a route between the points using OSRM
        try {
          const routeResponse = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${pCoords[1]},${pCoords[0]};${dCoords[1]},${dCoords[0]}?overview=full&geometries=geojson`
          );
          
          if (routeResponse.ok) {
            const routeData = await routeResponse.json();
            
            if (routeData.routes && routeData.routes.length > 0) {
              // Extract the route coordinates
              const route = routeData.routes[0].geometry.coordinates.map(
                (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
              );
              
              setRoutePoints(route);
              
              // Get the distance from the API response
              const distanceInMeters = routeData.routes[0].distance;
              if (distanceInMeters) {
                const distanceInKm = distanceInMeters / 1000;
                setRouteDistance(formatDistance(distanceInKm));
              } else {
                // Fall back to calculated direct distance
                setRouteDistance(formatDistance(directDistance));
              }
              
              // Set zoom based on the distance
              const distance = pCoords[0] - dCoords[0];
              const absDistance = Math.abs(distance);
              
              if (absDistance > 0.5) setMapZoom(9);
              else if (absDistance > 0.2) setMapZoom(10);
              else if (absDistance > 0.1) setMapZoom(11);
              else if (absDistance > 0.05) setMapZoom(12);
              else setMapZoom(13);
            }
          } else {
            // If route API fails, create a simple straight line
            setRoutePoints([
              { lat: pCoords[0], lng: pCoords[1] },
              { lat: dCoords[0], lng: dCoords[1] }
            ]);
            
            // Use direct distance calculation
            setRouteDistance(formatDistance(directDistance));
          }
        } catch (routeError) {
          console.error("Error fetching route:", routeError);
          // Fallback to straight line
          setRoutePoints([
            { lat: pCoords[0], lng: pCoords[1] },
            { lat: dCoords[0], lng: dCoords[1] }
          ]);
          
          // Use direct distance calculation
          setRouteDistance(formatDistance(directDistance));
        }
        
      } catch (error) {
        console.error("Error loading coordinates:", error);
        
        // Fallback to default coordinates - use current location if available
        const pCoords: [number, number] = currentLocation ? 
          [currentLocation[0] + 0.01, currentLocation[1] + 0.01] : 
          [28.6139, 77.2090];
          
        const dCoords: [number, number] = currentLocation ?
          [currentLocation[0] - 0.01, currentLocation[1] - 0.01] :
          [28.6329, 77.2195];
        
        setPickupCoords(pCoords);
        setDropCoords(dCoords);
        setMapCenter([
          (pCoords[0] + dCoords[0]) / 2,
          (pCoords[1] + dCoords[1]) / 2
        ]);
        setMapZoom(13); // Closer zoom for fallback
        
        // Simple straight line for route
        setRoutePoints([
          { lat: pCoords[0], lng: pCoords[1] },
          { lat: dCoords[0], lng: dCoords[1] }
        ]);
        
        // Calculate a fallback distance
        const directDistance = calculateDistance(
          pCoords[0], pCoords[1], 
          dCoords[0], dCoords[1]
        );
        setRouteDistance(formatDistance(directDistance));
      } finally {
        setIsLoading(false);
      }
    };

    loadCoordinates();
  }, [selectedRide, currentLocation]);

  // Custom marker icons
  const pickupIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const dropIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const driverIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  // Find the middle point of the route for placing the distance tooltip
  const getMidPoint = (): [number, number] | null => {
    if (routePoints.length === 0) return null;
    
    if (routePoints.length === 2) {
      // If it's just a straight line, get the midpoint
      return [
        (routePoints[0].lat + routePoints[1].lat) / 2,
        (routePoints[0].lng + routePoints[1].lng) / 2
      ];
    }
    
    // If it's a complex route, get a point somewhere in the middle
    const midIndex = Math.floor(routePoints.length / 2);
    return [routePoints[midIndex].lat, routePoints[midIndex].lng];
  };

  const midPoint = getMidPoint();

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={mapZoom} 
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
      zoomControl={true}
    >
      <ChangeView center={mapCenter} zoom={mapZoom} />
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Show current location marker - always show this */}
      {currentLocation && (
        <>
          <Marker 
            position={currentLocation} 
            icon={driverIcon}
          >
            <Tooltip permanent={false} direction="top" opacity={0.9}>
              <div className="font-semibold">Your Current Location</div>
            </Tooltip>
            <Popup>
              <div className="font-semibold">Your Current Location</div>
              {currentAddress ? (
                <div className="text-sm">{currentAddress}</div>
              ) : (
                <div className="text-sm text-gray-500">
                  {currentLocation[0].toFixed(6)}, {currentLocation[1].toFixed(6)}
                </div>
              )}
            </Popup>
          </Marker>
          
          <Circle 
            center={currentLocation}
            radius={200}
            pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.1 }}
          />
        </>
      )}
      
      {/* Only show ride markers and route if a ride is selected */}
      {selectedRide && (
        <>
          {pickupCoords && (
            <Marker position={pickupCoords} icon={pickupIcon}>
              <Tooltip permanent={false} direction="top" opacity={0.9}>
                <div className="font-semibold">Pickup Point</div>
              </Tooltip>
              <Popup>
                <div className="font-semibold">Pickup Point</div>
                <div className="text-sm">{selectedRide.pickupAddress}</div>
              </Popup>
            </Marker>
          )}
          
          {dropCoords && (
            <Marker position={dropCoords} icon={dropIcon}>
              <Tooltip permanent={false} direction="top" opacity={0.9}>
                <div className="font-semibold">Destination</div>
              </Tooltip>
              <Popup>
                <div className="font-semibold">Destination</div>
                <div className="text-sm">{selectedRide.dropAddress}</div>
              </Popup>
            </Marker>
          )}
          
          {routePoints.length > 0 && (
            <Polyline
              positions={routePoints}
              pathOptions={{
                color: '#990000', // Dark red color for better visibility
                weight: 5, // Slightly thicker
                opacity: 0.8, // More opaque
                dashArray: '10, 10' // Makes the line dotted
              }}
            >
              {midPoint && (
                <Tooltip permanent={true} direction="top" className="distance-tooltip">
                  <div className="bg-white px-2 py-1 rounded shadow text-center">
                    <span className="font-bold text-red-700">{routeDistance}</span>
                  </div>
                </Tooltip>
              )}
            </Polyline>
          )}
        </>
      )}
      
      {/* Show error message if location access was denied */}
      {locationError && (
        <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow-md z-[1000] text-xs text-red-600">
          <p>Unable to get your location: {locationError}</p>
          <p>Using default location instead.</p>
        </div>
      )}
    </MapContainer>
  );
};

export default MapComponent;