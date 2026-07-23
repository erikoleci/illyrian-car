export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url: string;
  available: boolean;
  created_at?: string;

  // Additional optional specs for rental cars / vehicles
  brand?: string;
  model?: string;
  year?: number;
  transmission?: string;
  fuel?: string;
  seats?: number;
}
