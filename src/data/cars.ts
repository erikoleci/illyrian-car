import { Car, CarFilterOptions } from '../types/car';

/**
 * ILLYRIAN RENTAL CAR FLEET DATA
 * 
 * Edit this array to add, update, or remove cars.
 * All changes here automatically reflect throughout the website.
 * 
 * Future Backend Integration Notice:
 * To connect to Supabase/Firebase/API in the future, replace or extend
 * the exported functions at the bottom of this file (`getCars()`, etc.).
 */
export const initialCars: Car[] = [
  {
    id: 1,
    brand: "BMW",
    model: "5 Series",
    year: 2024,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    ],
    pricePerDay: 120,
    transmission: "Automatic",
    fuel: "Diesel",
    seats: 5,
    type: "Sedan",
    description: "Luxury business sedan with ambient lighting, M-Sport package, leather interior, and advanced driver assistance for comfortable long highway drives.",
    available: true,
    featured: true,
    engineSize: "2.0L Turbo",
    doors: 4,
    luggageCapacity: 3,
    minDriverAge: 21
  },
  {
    id: 2,
    brand: "Mercedes-Benz",
    model: "G-Class AMG G63",
    year: 2024,
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80"
    ],
    pricePerDay: 350,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    type: "Luxury",
    description: "The icon of luxury SUVs. Unmatched presence, V8 Twin-Turbo engine, Burmester sound system, and supreme off-road or VIP city cruising status.",
    available: true,
    featured: true,
    engineSize: "4.0L V8 Biturbo",
    doors: 5,
    luggageCapacity: 4,
    minDriverAge: 25
  },
  {
    id: 3,
    brand: "Audi",
    model: "RS6 Avant",
    year: 2024,
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80"
    ],
    pricePerDay: 220,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    type: "Luxury",
    description: "High-performance luxury wagon combining supercar speed with everyday practicality. Quattro all-wheel drive and matrix LED headlights.",
    available: true,
    featured: true,
    engineSize: "4.0L V8 Twin-Turbo",
    doors: 5,
    luggageCapacity: 4,
    minDriverAge: 23
  },
  {
    id: 4,
    brand: "Porsche",
    model: "Panamera GTS",
    year: 2023,
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80"
    ],
    pricePerDay: 280,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 4,
    type: "Luxury",
    description: "Executive sports sedan engineered with pure Porsche DNA. Experience effortless speed, adaptive air suspension, and breathtaking design.",
    available: true,
    featured: true,
    engineSize: "4.0L V8",
    doors: 4,
    luggageCapacity: 3,
    minDriverAge: 24
  },
  {
    id: 5,
    brand: "Range Rover",
    model: "Sport Dynamic",
    year: 2024,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80"
    ],
    pricePerDay: 250,
    transmission: "Automatic",
    fuel: "Hybrid",
    seats: 5,
    type: "SUV",
    description: "Refined luxury SUV with commanding road presence, panoramic glass roof, Meridian sound, and versatile terrain response.",
    available: true,
    featured: false,
    engineSize: "3.0L Hybrid",
    doors: 5,
    luggageCapacity: 4,
    minDriverAge: 23
  },
  {
    id: 6,
    brand: "Mercedes-Benz",
    model: "E-Class AMG Line",
    year: 2024,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80"
    ],
    pricePerDay: 130,
    transmission: "Automatic",
    fuel: "Diesel",
    seats: 5,
    type: "Sedan",
    description: "Superior elegance and modern digital cockpit. Perfect choice for executive business meetings, airport arrivals, or coastal road trips.",
    available: true,
    featured: false,
    engineSize: "2.0L Diesel",
    doors: 4,
    luggageCapacity: 3,
    minDriverAge: 21
  },
  {
    id: 7,
    brand: "Volkswagen",
    model: "Golf 8 R-Line",
    year: 2023,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80"
    ],
    pricePerDay: 55,
    transmission: "Automatic",
    fuel: "Diesel",
    seats: 5,
    type: "Hatchback",
    description: "Agile, modern, and extremely economic hatchback. Ideal for navigating Tirana city streets and scenic Albanian coastline with ease.",
    available: true,
    featured: false,
    engineSize: "2.0L TDI",
    doors: 5,
    luggageCapacity: 2,
    minDriverAge: 20
  },
  {
    id: 8,
    brand: "Audi",
    model: "Q7 S-Line",
    year: 2024,
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"
    ],
    pricePerDay: 160,
    transmission: "Automatic",
    fuel: "Diesel",
    seats: 7,
    type: "SUV",
    description: "Spacious 7-seater premium family SUV. Full leather interior, virtual cockpit, and smooth Quattro driving dynamics.",
    available: true,
    featured: false,
    engineSize: "3.0L TDI V6",
    doors: 5,
    luggageCapacity: 5,
    minDriverAge: 22
  },
  {
    id: 9,
    brand: "Tesla",
    model: "Model Y Performance",
    year: 2024,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80"
    ],
    pricePerDay: 140,
    transmission: "Automatic",
    fuel: "Electric",
    seats: 5,
    type: "Electric",
    description: "100% Electric SUV with thrilling instant acceleration, autopilot features, glass roof, and zero emissions. Charging cable included.",
    available: false,
    featured: false,
    engineSize: "Dual Motor EV",
    doors: 5,
    luggageCapacity: 4,
    minDriverAge: 21
  }
];

// Data accessor helpers - structured for easy replacement with backend API
export function getAllCars(): Car[] {
  return initialCars;
}

export function getCarById(id: number): Car | undefined {
  return initialCars.find((car) => car.id === id);
}

export function getFeaturedCars(): Car[] {
  return initialCars.filter((car) => car.featured);
}

export function filterCars(options: CarFilterOptions): Car[] {
  return initialCars.filter((car) => {
    // Search query filter (Brand or Model)
    if (options.searchQuery.trim() !== '') {
      const q = options.searchQuery.toLowerCase();
      const name = `${car.brand} ${car.model}`.toLowerCase();
      if (!name.includes(q) && !car.type.toLowerCase().includes(q)) {
        return false;
      }
    }

    // Brand filter
    if (options.brand && options.brand !== 'All' && car.brand.toLowerCase() !== options.brand.toLowerCase()) {
      return false;
    }

    // Type filter
    if (options.type && options.type !== 'All' && car.type.toLowerCase() !== options.type.toLowerCase()) {
      return false;
    }

    // Transmission filter
    if (options.transmission && options.transmission !== 'All' && car.transmission.toLowerCase() !== options.transmission.toLowerCase()) {
      return false;
    }

    // Fuel filter
    if (options.fuel && options.fuel !== 'All' && car.fuel.toLowerCase() !== options.fuel.toLowerCase()) {
      return false;
    }

    // Price filter
    if (options.maxPrice && car.pricePerDay > options.maxPrice) {
      return false;
    }

    // Availability filter
    if (options.onlyAvailable && !car.available) {
      return false;
    }

    return true;
  });
}

export function getUniqueBrands(): string[] {
  const brands = Array.from(new Set(initialCars.map((car) => car.brand)));
  return brands.sort();
}
