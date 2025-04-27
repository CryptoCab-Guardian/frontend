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
      category: "UberX",
      price: "$22.30",
      pickupAddress: "123 Main St",
      dropAddress: "456 Park Ave",
      description: "Affordable everyday rides for individuals and small groups",
      capacity: 4,
      image: "/client/Uber.png", 
    },
    {
      id: "C002",
      category: "UberXL",
      price: "$35.50",
      pickupAddress: "123 Main St",
      dropAddress: "456 Park Ave",
      description: "Spacious rides for up to 6 passengers",
      capacity: 6,
      image: "/client/Uber_Black.webp",
    },
    {
      id: "C003",
      category: "Uber Black",
      price: "$55.00",
      pickupAddress: "123 Main St",
      dropAddress: "456 Park Ave",
      description: "Premium rides in luxury black cars with professional drivers",
      capacity: 4,
      image: "/client/Uber_Black.png",
    },
    {
      id: "C004",
      category: "Uber Comfort",
      price: "$28.75",
      pickupAddress: "789 Broadway",
      dropAddress: "101 Central Park",
      description: "Newer cars with extra legroom and top-rated drivers",
      capacity: 4,
      image: "/client/Uber.png",
    },
    {
      id: "C005",
      category: "Uber Green",
      price: "$25.60",
      pickupAddress: "789 Broadway",
      dropAddress: "101 Central Park",
      description: "Eco-friendly rides in electric or hybrid vehicles",
      capacity: 4,
      image: "/client/Uber.png",
    },
    {
      id: "C006",
      category: "Uber Pet",
      price: "$30.00",
      pickupAddress: "789 Broadway",
      dropAddress: "101 Central Park",
      description: "Rides that welcome you and your furry friend",
      capacity: 4,
      image: "/client/taxi.png",
    },
  ];
  
  export const allLocations = [
    "123 Main St",
    "456 Park Ave",
    "789 Broadway",
    "101 Central Park",
    "Elm St",
    "Oakwood Rd",
    "Maple Ave",
    "Market St"
  ];