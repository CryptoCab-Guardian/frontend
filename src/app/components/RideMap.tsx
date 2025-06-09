"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RideMapProps {
	driverPosition?: { lat: number; lng: number };
	pickupAddress: string;
	dropAddress: string;
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

const RideMap: React.FC<RideMapProps> = ({ driverPosition, pickupAddress, dropAddress }) => {
	const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
	const [dropCoords, setDropCoords] = useState<[number, number] | null>(null);
	const [mapCenter, setMapCenter] = useState<[number, number]>([22.5726, 88.3639]); // Default to Kolkata
	const [mapZoom, setMapZoom] = useState(13);
	const [routePoints, setRoutePoints] = useState<{ lat: number; lng: number }[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fix Leaflet default icon issue
	useEffect(() => {
		// only run on client
		if (typeof window !== 'undefined') {
			// Fix the default icon issue
			delete (L.Icon.Default.prototype as any)._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
				iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
				shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
			});
		}
	}, []);

	useEffect(() => {
		const loadMapData = async () => {
			setIsLoading(true);

			try {
				// Geocode pickup address
				const pickupResult = await geocodeAddress(pickupAddress);
				if (pickupResult) {
					setPickupCoords(pickupResult);
				}

				// Geocode drop address
				const dropResult = await geocodeAddress(dropAddress);
				if (dropResult) {
					setDropCoords(dropResult);
				}

				// Determine map center
				if (driverPosition) {
					// If driver position is available, center between driver and pickup
					const driverCoords: [number, number] = [driverPosition.lat, driverPosition.lng];
					const centerPoint = pickupResult || dropResult || driverCoords;
					setMapCenter(centerPoint);

					// Create route points
					if (pickupResult) {
						setRoutePoints([
							{ lat: driverPosition.lat, lng: driverPosition.lng },
							{ lat: pickupResult[0], lng: pickupResult[1] }
						]);

						// If we also have drop coordinates, add the full route
						if (dropResult) {
							setRoutePoints([
								{ lat: driverPosition.lat, lng: driverPosition.lng },
								{ lat: pickupResult[0], lng: pickupResult[1] },
								{ lat: dropResult[0], lng: dropResult[1] }
							]);
						}
					}
				} else if (pickupResult && dropResult) {
					// No driver position, center between pickup and drop
					setMapCenter([
						(pickupResult[0] + dropResult[0]) / 2,
						(pickupResult[1] + dropResult[1]) / 2
					]);

					// Create route points
					setRoutePoints([
						{ lat: pickupResult[0], lng: pickupResult[1] },
						{ lat: dropResult[0], lng: dropResult[1] }
					]);
				} else if (pickupResult) {
					setMapCenter(pickupResult);
				} else if (dropResult) {
					setMapCenter(dropResult);
				}

				// Set appropriate zoom level
				if (pickupResult && dropResult) {
					// Calculate distance and set zoom accordingly
					const distance = calculateDistance(
						pickupResult[0], pickupResult[1],
						dropResult[0], dropResult[1]
					);

					if (distance > 10) setMapZoom(10);
					else if (distance > 5) setMapZoom(11);
					else if (distance > 2) setMapZoom(12);
					else if (distance > 1) setMapZoom(13);
					else setMapZoom(14);
				} else {
					setMapZoom(13);
				}
			} catch (error) {
				console.error("Error loading map data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadMapData();
	}, [driverPosition, pickupAddress, dropAddress]);

	// Geocode address to coordinates
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

	// Calculate distance between two coordinates (Haversine formula)
	const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
		const R = 6371; // Radius of the Earth in kilometers
		const dLat = (lat2 - lat1) * Math.PI / 180;
		const dLon = (lon2 - lon1) * Math.PI / 180;
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
			Math.sin(dLon / 2) * Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c; // Distance in kilometers
	};

	// Custom marker icons
	const driverIcon = new L.Icon({
		iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
		shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	});

	const pickupIcon = new L.Icon({
		iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
		shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	});

	const dropIcon = new L.Icon({
		iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
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

			{/* Driver's position */}
			{driverPosition && (
				<>
					<Marker position={[driverPosition.lat, driverPosition.lng]} icon={driverIcon}>
						<Popup>
							<div className="font-semibold">Drivers Location</div>
							<div className="text-xs text-gray-500">Heading to pickup point</div>
						</Popup>
					</Marker>

					<Circle
						center={[driverPosition.lat, driverPosition.lng]}
						radius={100}
						pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.1 }}
					/>
				</>
			)}

			{/* Pickup location */}
			{pickupCoords && (
				<Marker position={pickupCoords} icon={pickupIcon}>
					<Popup>
						<div className="font-semibold">Pickup Point</div>
						<div className="text-xs">{pickupAddress}</div>
					</Popup>
				</Marker>
			)}

			{/* Destination location */}
			{dropCoords && (
				<Marker position={dropCoords} icon={dropIcon}>
					<Popup>
						<div className="font-semibold">Destination</div>
						<div className="text-xs">{dropAddress}</div>
					</Popup>
				</Marker>
			)}

			{/* Route lines */}
			{routePoints.length >= 2 && (
				<Polyline
					positions={routePoints}
					pathOptions={{
						color: '#990000',
						weight: 4,
						opacity: 0.7,
						dashArray: '10, 10'
					}}
				/>
			)}
		</MapContainer>
	);
};

export default RideMap;