// import React, { useState } from 'react';

// interface RideSearchFormProps {
//   locations: string[];
//   onSearch: (from: string, to: string) => void;
// }

// const RideSearchForm: React.FC<RideSearchFormProps> = ({ locations, onSearch }) => {
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
//   const [toSuggestions, setToSuggestions] = useState<string[]>([]);

//   const handleFromChange = (value: string) => {
//     setFrom(value);
//     if (!document.activeElement?.id?.includes("from")) return;
//     const filtered = locations.filter((loc) =>
//       loc.toLowerCase().includes(value.toLowerCase())
//     );
//     setFromSuggestions(filtered);
//   };

//   const handleToChange = (value: string) => {
//     setTo(value);
//     if (!document.activeElement?.id?.includes("to")) return;
//     const filtered = locations.filter((loc) =>
//       loc.toLowerCase().includes(value.toLowerCase())
//     );
//     setToSuggestions(filtered);
//   };

//   return (
//     <div className="bg-white p-4 rounded-xl shadow mb-4">
//       <h2 className="text-lg font-bold mb-4">Get a Ride</h2>

//       <div className="relative mb-4">
//         <label className="block text-sm font-semibold mb-1">
//           Pickup Location
//         </label>
//         <input
//           id="from-input"
//           type="text"
//           className="w-full px-4 py-2 border rounded-lg shadow-sm"
//           placeholder="Pickup Location"
//           value={from}
//           onChange={(e) => handleFromChange(e.target.value)}
//         />
//         {from && fromSuggestions.length > 0 && (
//           <ul className="absolute bg-white border w-full rounded-md mt-1 z-10 max-h-40 overflow-auto">
//             {fromSuggestions.map((place, idx) => (
//               <li
//                 key={idx}
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
//           placeholder="Drop Location"
//           value={to}
//           onChange={(e) => handleToChange(e.target.value)}
//         />
//         {to && toSuggestions.length > 0 && (
//           <ul className="absolute bg-white border w-full rounded-md mt-1 z-10 max-h-40 overflow-auto">
//             {toSuggestions.map((place, idx) => (
//               <li
//                 key={idx}
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
//         className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
//       >
//         Search
//       </button>
//     </div>
//   );
// };

// export default RideSearchForm;



import React, { useState, useCallback } from 'react';

interface RideSearchFormProps {
  onSearch: (from: string, to: string) => void;
}

// We don't need the locations prop anymore as we'll use the API
const RideSearchForm: React.FC<RideSearchFormProps> = ({ onSearch }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [isLoadingFrom, setIsLoadingFrom] = useState(false);
  const [isLoadingTo, setIsLoadingTo] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch places from Nominatim API
  const fetchPlaces = async (query: string) => {
    if (!query || query.length < 3) return [];
    
    try {
      // Add a small delay between requests to respect API limits
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: {
            // Add a custom User-Agent as per Nominatim usage policy
            'User-Agent': 'RideBookingApp/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      // Format the results to show readable place names
      return data.map((item: { display_name: string }) => item.display_name);
    } catch (error) {
      setError("Failed to fetch location suggestions");
      console.error("Error fetching places:", error);
      return [];
    }
  };

  // Use a timeout to debounce API calls
  const debouncedFetchFrom = useCallback((query: string) => {
    const timer = setTimeout(async () => {
      if (query.length >= 3) {
        setIsLoadingFrom(true);
        const suggestions = await fetchPlaces(query);
        setFromSuggestions(suggestions);
        setIsLoadingFrom(false);
      }
    }, 500); // 500ms delay

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
    }, 500); // 500ms delay

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

      <button
        onClick={() => onSearch(from, to)}
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