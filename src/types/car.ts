export type CarType = 'SUV' | 'Sedan' | 'Electric' | 'Luxury' | 'Hatchback' | 'Convertible';
export type Transmission = 'Automatic' | 'Manual';
export type FuelType = 'Diesel' | 'Petrol' | 'Hybrid' | 'Electric';

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  image: string;
  gallery?: string[];
  pricePerDay: number;
  transmission: Transmission;
  fuel: FuelType;
  seats: number;
  type: CarType;
  description: string;
  available: boolean;
  featured?: boolean;
  engineSize?: string;
  acceleration?: string;
  luggageCapacity?: number; // count of suitcases
  doors?: number;
  minDriverAge?: number;
}

export interface CarFilterOptions {
  searchQuery: string;
  brand: string;
  type: string; // 'All' or CarType
  transmission: string; // 'All' or Transmission
  fuel: string; // 'All' or FuelType
  maxPrice: number;
  onlyAvailable: boolean;
}
