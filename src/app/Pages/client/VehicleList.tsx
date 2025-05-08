
import React from 'react';
import VehicleCard from './VehicleCard';

// Type for our vehicle object
interface Vehicle {
  id: string;
  category: string;
  price: string;
  pickupAddress: string;
  dropAddress: string;
  description: string;
  capacity: number;
  image: string;
}

interface Coordinates {
  lat: string;
  lng: string;
}

interface VehicleListProps {
  vehicles: Vehicle[];
  showList: boolean;
  selectedPrice?: string;
  pickupLocation?: Coordinates;
  dropoffLocation?: Coordinates;
}



const VehicleList: React.FC<VehicleListProps> = ({ vehicles, showList, selectedPrice ,pickupLocation, 
  dropoffLocation  }) => {
  if (!showList) return null;
  
  return (
    <>
      <div className="text-xl font-bold mb-4">Available Rides</div>
      {vehicles.length === 0 ? (
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          No vehicles available for this route.
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((vehicle) => (
            <VehicleCard 
            key={vehicle.id} 
            vehicle={vehicle} 
            selectedPrice={selectedPrice}
            pickupLocation={{ lat: pickupLocation?.lat || '', lng: pickupLocation?.lng || '' }}
            dropoffLocation={{ lat: dropoffLocation?.lat || '', lng: dropoffLocation?.lng || '' }}
          />
          ))}
        </div>
      )}
    </>
  );
};

export default VehicleList;