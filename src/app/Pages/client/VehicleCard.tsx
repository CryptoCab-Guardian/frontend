import React from 'react';
import Image from 'next/image';
import { User2 } from 'lucide-react';

interface VehicleCardProps {
  car: {
    id: string;
    category: string;
    price: string;
    pickupAddress: string;
    dropAddress: string;
    description: string;
    capacity: number;
    image: string;
  };
}

const VehicleCard: React.FC<VehicleCardProps> = ({ car }) => {
  return (
    <div className="flex items-start space-x-6 bg-white p-6 rounded-2xl shadow-lg">
      <Image
        src={car.image}
        alt={car.category}
        width={160}
        height={160}
        className="-p-0"
      />
      <div className="flex-1">
        <div className="flex items-center gap-3 text-xl font-bold text-gray-800 mb-1">
          {car.category} <User2 size={20} /> {car.capacity}
        </div>
        <p className="text-base text-gray-600 mb-2">
          {car.description}
        </p>
        <div className="text-lg font-semibold text-green-600">
          {car.price}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;