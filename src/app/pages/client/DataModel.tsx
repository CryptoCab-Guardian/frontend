export interface Vehicle {
  id: string;
  category: string;
  price: string;
  pickupAddress: string;
  dropAddress: string;
  description: string;
  capacity: number;
  image: string;
}

export const mockCars: Vehicle[] = [
  {
    id: "C001",
    category: "Mini",
    price: "₹100",
    pickupAddress: "Academy of Technology, Adisaptagram, Hooghly",
    dropAddress: "Eden Gardens, Kolkata",
    description: "Compact and budget-friendly rides for short distances",
    capacity: 4,
    image: "/client/Uber.png",
  },
  {
    id: "C002",
    category: "Sedan",
    price: "₹100",
    pickupAddress: "Kalibazar, Bardhaman, Burdwan - I, Purba Bardhaman, West Bengal, 713103, India",
    dropAddress: "Curzon Gate, BC Road, Bamakalitala, Badamtala, Bardhaman, Burdwan - I, Purba Bardhaman, West Bengal, 713101, India",
    description: "Comfortable rides suitable for everyday travel",
    capacity: 4,
    image: "/client/Uber_Black.webp",
  },
  {
    id: "C003",
    category: "Luxury",
    price: "₹100",
    pickupAddress: "South Talbagicha, Kharagpur",
    dropAddress: "Academy of Technology, Grand Trunk Road",
    description: "Premium rides in luxury vehicles with professional drivers",
    capacity: 4,
    image: "/client/Uber_Black.webp",
  },
  {
    id: "C004",
    category: "SUV",
    price: "₹100",
    pickupAddress: "Academy of Technology, Adisaptagram, Hooghly",
    dropAddress: "Eden Garden Park, Esplanade, Kolkata",
    description: "Spacious SUVs for families and groups",
    capacity: 6,
    image: "/client/Uber.png",
  },
  {
    id: "C005",
    category: "Van",
    price: "₹100",
    pickupAddress: "South Talbagicha, Kharagpur",
    dropAddress: "Eden Garden Park, Esplanade, Kolkata",
    description: "Ideal for groups or extra luggage",
    capacity: 7,
    image: "/client/taxi.png",
  },
  {
    id: "C006",
    category: "SUV",
    price: "₹100",
    pickupAddress: "Academy of Technology, Adisaptagram, Hooghly",
    dropAddress: "Eden Garden Park, Esplanade, Kolkata",
    description: "Rides that welcome you and your furry friend",
    capacity: 6,
    image: "/client/Uber.png",
  },
  {
    id: "C007",
    category: "SUV",
    price: "₹100",
    pickupAddress: "Strand Road, B. B. D. Bagh, Kolkata, West Bengal, 700021, India",
    dropAddress: "Eden Garden Park, Esplanade, Kolkata",
    description: "Rides that welcome you and your furry friend",
    capacity: 6,
    image: "/client/Uber.png",
  },
];