
// import React, { useState, useCallback } from 'react';

// interface RideSearchFormProps {
//   onSearch: (from: string, to: string) => void;
// }

// // We don't need the locations prop anymore as we'll use the API
// const RideSearchForm: React.FC<RideSearchFormProps> = ({ onSearch }) => {
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
//   const [toSuggestions, setToSuggestions] = useState<string[]>([]);
//   const [isLoadingFrom, setIsLoadingFrom] = useState(false);
//   const [isLoadingTo, setIsLoadingTo] = useState(false);
//   const [error, setError] = useState("");

//   // Function to fetch places from Nominatim API
//   const fetchPlaces = async (query: string) => {
//     if (!query || query.length < 3) return [];
    
//     try {
//       // Add a small delay between requests to respect API limits
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
//         {
//           headers: {
//             // Add a custom User-Agent as per Nominatim usage policy
//             'User-Agent': 'RideBookingApp/1.0'
//           }
//         }
//       );
      
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
      
//       const data = await response.json();
//       // Format the results to show readable place names
//       return data.map((item: { display_name: string }) => item.display_name);
//     } catch (error) {
//       setError("Failed to fetch location suggestions");
//       console.error("Error fetching places:", error);
//       return [];
//     }
//   };

//   // Use a timeout to debounce API calls
//   const debouncedFetchFrom = useCallback((query: string) => {
//     const timer = setTimeout(async () => {
//       if (query.length >= 3) {
//         setIsLoadingFrom(true);
//         const suggestions = await fetchPlaces(query);
//         setFromSuggestions(suggestions);
//         setIsLoadingFrom(false);
//       }
//     }, 500); // 500ms delay

//     return () => clearTimeout(timer);
//   }, []);

//   const debouncedFetchTo = useCallback((query: string) => {
//     const timer = setTimeout(async () => {
//       if (query.length >= 3) {
//         setIsLoadingTo(true);
//         const suggestions = await fetchPlaces(query);
//         setToSuggestions(suggestions);
//         setIsLoadingTo(false);
//       }
//     }, 500); 

//     return () => clearTimeout(timer);
//   }, []);

//   const handleFromChange = (value: string) => {
//     setFrom(value);
//     setFromSuggestions([]);
//     if (value.length >= 3) {
//       debouncedFetchFrom(value);
//     }
//   };

//   const handleToChange = (value: string) => {
//     setTo(value);
//     setToSuggestions([]);
//     if (value.length >= 3) {
//       debouncedFetchTo(value);
//     }
//   };

//   return (
//     <div className="bg-white p-4 rounded-xl shadow mb-4">
//       <h2 className="text-lg font-bold mb-4">Get a Ride</h2>

//       {error && (
//         <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <div className="relative mb-4">
//         <label className="block text-sm font-semibold mb-1">
//           Pickup Location
//         </label>
//         <input
//           id="from-input"
//           type="text"
//           className="w-full px-4 py-2 border rounded-lg shadow-sm"
//           placeholder="Pickup Location (enter at least 3 characters)"
//           value={from}
//           onChange={(e) => handleFromChange(e.target.value)}
//         />
//         {isLoadingFrom && (
//           <div className="absolute right-3 top-9">
//             <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
//           </div>
//         )}
//         {fromSuggestions.length > 0 && (
//           <ul className="absolute bg-white border w-full rounded-md mt-1 z-10 max-h-40 overflow-auto shadow-lg">
//             {fromSuggestions.map((place, idx) => (
//               <li
//                 key={idx}
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-0"
//                 onClick={() => {
//                   setFrom(place);
//                   setFromSuggestions([]);
//                 }}
//               >
//                 {place}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <div className="relative mb-4">
//         <label className="block text-sm font-semibold mb-1">
//           Dropoff Location
//         </label>
//         <input
//           id="to-input"
//           type="text"
//           className="w-full px-4 py-2 border rounded-lg shadow-sm"
//           placeholder="Drop Location (enter at least 3 characters)"
//           value={to}
//           onChange={(e) => handleToChange(e.target.value)}
//         />
//         {isLoadingTo && (
//           <div className="absolute right-3 top-9">
//             <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
//           </div>
//         )}
//         {toSuggestions.length > 0 && (
//           <ul className="absolute bg-white border w-full rounded-md mt-1 z-10 max-h-40 overflow-auto shadow-lg">
//             {toSuggestions.map((place, idx) => (
//               <li
//                 key={idx}
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-0"
//                 onClick={() => {
//                   setTo(place);
//                   setToSuggestions([]);
//                 }}
//               >
//                 {place}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <button
//         onClick={() => onSearch(from, to)}
//         disabled={!from || !to}
//         className={`w-full py-2 rounded-lg font-semibold transition ${
//           !from || !to 
//             ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
//             : "bg-black text-white hover:bg-gray-800"
//         }`}
//       >
//         Search
//       </button>
//     </div>
//   );
// };

// export default RideSearchForm;



import React, { useState, useCallback } from 'react';

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
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [vehicleType, setVehicleType] = useState(vehicleTypes[0].id);
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [isLoadingFrom, setIsLoadingFrom] = useState(false);
  const [isLoadingTo, setIsLoadingTo] = useState(false);
  const [error, setError] = useState("");

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

  const debouncedFetchFrom = useCallback((query: string) => {
    const timer = setTimeout(async () => {
      if (query.length >= 3) {
        setIsLoadingFrom(true);
        const suggestions = await fetchPlaces(query);
        setFromSuggestions(suggestions);
        setIsLoadingFrom(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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

  const handleFromChange = (value: string) => {
    setFrom(value);
    setFromSuggestions([]);
    if (value.length >= 3) {
      debouncedFetchFrom(value);
    }
  };

  const handleToChange = (value: string) => {
    setTo(value);
    setToSuggestions([]);
    if (value.length >= 3) {
      debouncedFetchTo(value);
    }
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
          Pickup Location
        </label>
        <input
          id="from-input"
          type="text"
          className="w-full px-4 py-2 border rounded-lg shadow-sm"
          placeholder="Pickup Location (enter at least 3 characters)"
          value={from}
          onChange={(e) => handleFromChange(e.target.value)}
        />
        {isLoadingFrom && (
          <div className="absolute right-3 top-9">
            <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
          </div>
        )}
        {fromSuggestions.length > 0 && (
          <ul className="absolute bg-white border w-full rounded-md mt-1 z-10 max-h-40 overflow-auto shadow-lg">
            {fromSuggestions.map((place, idx) => (
              <li
                key={idx}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-0"
                onClick={() => {
                  setFrom(place);
                  setFromSuggestions([]);
                }}
              >
                {place}
              </li>
            ))}
          </ul>
        )}
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
        disabled={!from || !to}
        className={`w-full py-2 rounded-lg font-semibold transition ${
          !from || !to 
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