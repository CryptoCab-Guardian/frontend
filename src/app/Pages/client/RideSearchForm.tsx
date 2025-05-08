
import React, { useState, useCallback, useEffect } from 'react';

// Vehicle type definitions
export type VehicleType = {
  id: string;
  name: string;
  basePrice: number;
};

const vehicleTypes: VehicleType[] = [
  { id: 'sedan', name: 'Sedan', basePrice: 1.5 },
  { id: 'suv', name: 'SUV', basePrice: 2.0 },
  { id: 'luxury', name: 'Luxury', basePrice: 3.0 },
  { id: 'mini', name: 'Mini', basePrice: 1.0 },
  { id: 'van', name: 'Van', basePrice: 2.5 }
];

interface RideSearchFormProps {
  onSearch: (from: string, to: string, vehicleType: string) => void;
}

const RideSearchForm: React.FC<RideSearchFormProps> = ({ onSearch }) => {
  const [from, setFrom] = useState("Getting your current location...");
  const [to, setTo] = useState("");
  const [vehicleType, setVehicleType] = useState(vehicleTypes[0].id);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [isLoadingTo, setIsLoadingTo] = useState(false);
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(true);
  const [error, setError] = useState("");
  const [currentLocationCoords, setCurrentLocationCoords] = useState<{lat: number, lng: number} | null>(null);

  // Get user's current location when component mounts
  useEffect(() => {
    const fetchCurrentLocation = async () => {
      if (navigator.geolocation) {
        try {
          setIsLoadingCurrentLocation(true);
          
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setCurrentLocationCoords({ lat: latitude, lng: longitude });
              
              // Use reverse geocoding to get address from coordinates
              try {
                const address = await getAddressFromCoordinates(latitude, longitude);
                setFrom(address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
              } catch (error) {
                console.error("Error getting address:", error);
                setFrom(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
              }
              
              setIsLoadingCurrentLocation(false);
            },
            (error) => {
              console.error("Error getting location:", error);
              setError("Unable to get your current location. Please enable location services.");
              setIsLoadingCurrentLocation(false);
              setFrom("");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        } catch (error) {
          console.error("Geolocation error:", error);
          setError("Unable to access location services.");
          setIsLoadingCurrentLocation(false);
        }
      } else {
        setError("Geolocation is not supported by this browser.");
        setIsLoadingCurrentLocation(false);
      }
    };

    fetchCurrentLocation();
  }, []);

  // Function to get address from coordinates
  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`,
        {
          headers: {
            'User-Agent': 'RideBookingApp/1.0',
            'Accept-Language': 'en'
          }
        }
      );
      
      const data = await response.json();
      
      if (data && data.display_name) {
        
        return data.display_name;
      } else {
        console.error("Geocoding API error:", data);
        return null;
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return null;
    }
  };

  const fetchPlaces = async (query: string) => {
    if (!query || query.length < 3) return [];
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: {
            'User-Agent': 'RideBookingApp/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      return data.map((item: { display_name: string }) => item.display_name);
    } catch (error) {
      setError("Failed to fetch location suggestions");
      console.error("Error fetching places:", error);
      return [];
    }
  };

  const debouncedFetchTo = useCallback((query: string) => {
    const timer = setTimeout(async () => {
      if (query.length >= 3) {
        setIsLoadingTo(true);
        const suggestions = await fetchPlaces(query);
        setToSuggestions(suggestions);
        setIsLoadingTo(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleToChange = (value: string) => {
    setTo(value);
    setToSuggestions([]);
    if (value.length >= 3) {
      debouncedFetchTo(value);
    }
  };

  const handleRefreshLocation = async () => {
    setIsLoadingCurrentLocation(true);
    setFrom("Updating your location...");
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocationCoords({ lat: latitude, lng: longitude });
        
        try {
          const address = await getAddressFromCoordinates(latitude, longitude);
          setFrom(address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        } catch (error) {
          setFrom(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
        
        setIsLoadingCurrentLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setError("Unable to update your location.");
        setIsLoadingCurrentLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4">
      <h2 className="text-lg font-bold mb-4">Get a Ride</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}

      <div className="relative mb-4">
        <label className="block text-sm font-semibold mb-1">
          Pickup Location (Current)
        </label>
        <div className="flex">
          <input
            id="from-input"
            type="text"
            className="w-full px-4 py-2 border rounded-lg shadow-sm bg-gray-50"
            placeholder="Your current location"
            value={from}
            readOnly
            disabled
          />
          <button 
            onClick={handleRefreshLocation}
            className="ml-2 p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            title="Refresh location"
          >
            {isLoadingCurrentLocation ? (
              <span className="inline-block w-6 h-6">
                <svg className="animate-spin h-full w-full text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </span>
            ) : (
              <span className="inline-block w-5 h-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <label className="block text-sm font-semibold mb-1">
          Dropoff Location
        </label>
        <input
          id="to-input"
          type="text"
          className="w-full px-4 py-2 border rounded-lg shadow-sm"
          placeholder="Drop Location (enter at least 3 characters)"
          value={to}
          onChange={(e) => handleToChange(e.target.value)}
        />
        {isLoadingTo && (
          <div className="absolute right-3 top-9">
            <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
          </div>
        )}
        {toSuggestions.length > 0 && (
          <ul className="absolute bg-white border w-full rounded-md mt-1 z-10 max-h-40 overflow-auto shadow-lg">
            {toSuggestions.map((place, idx) => (
              <li
                key={idx}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-0"
                onClick={() => {
                  setTo(place);
                  setToSuggestions([]);
                }}
              >
                {place}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Vehicle Type Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">
          Vehicle Type
        </label>
        <div className="relative">
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm appearance-none bg-white"
          >
            {vehicleTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} - ${type.basePrice.toFixed(2)}/km
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>

      <button
        onClick={() => onSearch(from, to, vehicleType)}
        disabled={!from || !to || isLoadingCurrentLocation}
        className={`w-full py-2 rounded-lg font-semibold transition ${
          !from || !to || isLoadingCurrentLocation
            ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        Search
      </button>
    </div>
  );
};

export default RideSearchForm;