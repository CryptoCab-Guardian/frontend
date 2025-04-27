// import React from 'react';
// import VehicleCard from './VehicleCard';

// interface VehicleListProps {
//   vehicles: Array<{
//     id: string;
//     category: string;
//     price: string;
//     pickupAddress: string;
//     dropAddress: string;
//     description: string;
//     capacity: number;
//     image: string;
//   }>;
//   showList: boolean;
// }

// const VehicleList: React.FC<VehicleListProps> = ({ vehicles, showList }) => {
//   if (!showList) return null;
  
//   return (
//     <>
//       <div className="text-xl font-bold">Recommended Cars</div>
//       <div className="space-y-4 mt-4">
//         {vehicles.map((car) => (
//           <VehicleCard key={car.id} car={car} />
//         ))}
//       </div>
//     </>
//   );
// };

// export default VehicleList;




import React from 'react';
import Image from 'next/image';

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

interface VehicleListProps {
  vehicles: Vehicle[];
  showList: boolean;
  selectedPrice?: string;
}

const VehicleCard = ({ vehicle, selectedPrice }: { vehicle: Vehicle; selectedPrice?: string }) => (
  <div className="flex items-start space-x-4 bg-white p-4 rounded-xl shadow-md">
    <div className="flex-shrink-0">
      <Image
        src={vehicle.image}
        alt={vehicle.category}
        width={80}
        height={80}
        className="rounded-md"
      />
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{vehicle.category}</h3>
        <div className="text-lg font-bold text-green-600">
          {selectedPrice || vehicle.price}
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-1">{vehicle.description}</p>
      <div className="flex items-center text-sm text-gray-500">
        <span className="mr-2">Capacity: {vehicle.capacity}</span>
      </div>
    </div>
  </div>
);

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, showList, selectedPrice }) => {
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
            />
          ))}
        </div>
      )}
    </>
  );
};

export default VehicleList;